package com.colalimpa.service;

import com.colalimpa.dto.SolicitarCodigoRequest;
import com.colalimpa.dto.TokenResponse;
import com.colalimpa.dto.UsuarioResponse;
import com.colalimpa.dto.ValidarCodigoRequest;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.model.CodigoAutenticacao;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.CodigoAutenticacaoRepository;
import com.colalimpa.repository.UsuarioRepository;
import com.colalimpa.security.JwtService;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private static final int LIMITE_REQUISICOES_DIARIAS = 4;
    private static final int INTERVALO_REENVIO_SEGUNDOS = 30;
    private static final int TEMPO_EXPIRACAO_MINUTOS = 5;
    private static final int LIMITE_TENTATIVAS_INCORRETAS = 3;

    private final UsuarioRepository usuarioRepository;
    private final CodigoAutenticacaoRepository codigoRepository;
    private final EmailSenderService emailSenderService;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UsuarioRepository usuarioRepository,
            CodigoAutenticacaoRepository codigoRepository,
            EmailSenderService emailSenderService,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.codigoRepository = codigoRepository;
        this.emailSenderService = emailSenderService;
        this.jwtService = jwtService;
    }

    public void solicitarCodigo(SolicitarCodigoRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseGet(() -> {
                    String nomePadrao = request.email().split("@")[0];
                    Usuario novo = new Usuario(nomePadrao, request.email(), null, null, null);
                    return usuarioRepository.save(novo);
                });

        LocalDateTime umDiaAtras = LocalDateTime.now().minusDays(1);
        long enviosHoje = codigoRepository.countByUsuarioIdAndDataCriacaoAfter(usuario.getId(), umDiaAtras);
        if (enviosHoje >= LIMITE_REQUISICOES_DIARIAS) {
            throw new BusinessRuleException("Limite diário de envio de códigos atingido.");
        }

        codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(usuario.getId()).ifPresent(ultimo -> {
            LocalDateTime limiteReenvio = ultimo.getDataCriacao().plusSeconds(INTERVALO_REENVIO_SEGUNDOS);
            if (LocalDateTime.now().isBefore(limiteReenvio)) {
                throw new BusinessRuleException("Aguarde ao menos 30 segundos antes de solicitar um novo código.");
            }
        });

        String codigoGerado = String.format("%06d", secureRandom.nextInt(1_000_000));
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(TEMPO_EXPIRACAO_MINUTOS);

        CodigoAutenticacao codigoAutenticacao = new CodigoAutenticacao(
                usuario,
                codigoGerado,
                "EMAIL",
                expiracao
        );

        codigoRepository.save(codigoAutenticacao);
        emailSenderService.enviarCodigoAcesso(usuario.getEmail(), codigoGerado);
    }

    public TokenResponse validarCodigo(ValidarCodigoRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado para o e-mail informado."));

        CodigoAutenticacao ultimoCodigo = codigoRepository
                .findTopByUsuarioIdOrderByDataCriacaoDesc(usuario.getId())
                .orElseThrow(() -> new BusinessRuleException("Nenhum código ativo encontrado para este e-mail."));

        if (ultimoCodigo.isUtilizado()) {
            throw new BusinessRuleException("Código de autenticação expirado ou já utilizado.");
        }

        if (ultimoCodigo.isExpirado()) {
            throw new BusinessRuleException("O código informado expirou. Solicite um novo código.");
        }

        if (ultimoCodigo.getTentativasEnvio() != null && ultimoCodigo.getTentativasEnvio() >= LIMITE_TENTATIVAS_INCORRETAS) {
            throw new BusinessRuleException("Código bloqueado por excesso de tentativas incorretas.");
        }

        if (!ultimoCodigo.getCodigo().equals(request.codigo())) {
            ultimoCodigo.incrementarTentativas();
            codigoRepository.save(ultimoCodigo);
            throw new BusinessRuleException("Código de autenticação inválido.");
        }

        ultimoCodigo.marcarComoUtilizado();
        codigoRepository.save(ultimoCodigo);

        String tokenGerado = jwtService.gerarToken(usuario);
        return new TokenResponse(tokenGerado, UsuarioResponse.fromEntity(usuario));
    }
}

