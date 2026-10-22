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
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private static final int LIMITE_REQUISICOES_DIARIAS = 4;
    private static final int INTERVALO_REENVIO_SEGUNDOS = 30;
    private static final int TEMPO_EXPIRACAO_MINUTOS = 5;

    private final UsuarioRepository usuarioRepository;
    private final CodigoAutenticacaoRepository codigoRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UsuarioRepository usuarioRepository,
            CodigoAutenticacaoRepository codigoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.codigoRepository = codigoRepository;
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
    }

    public TokenResponse validarCodigo(ValidarCodigoRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado para o e-mail informado."));

        CodigoAutenticacao ultimoCodigo = codigoRepository
                .findTopByUsuarioIdOrderByDataCriacaoDesc(usuario.getId())
                .orElseThrow(() -> new BusinessRuleException("Nenhum código ativo encontrado para este e-mail."));

        if (ultimoCodigo.isExpirado()) {
            throw new BusinessRuleException("O código informado expirou. Solicite um novo código.");
        }

        if (!ultimoCodigo.getCodigo().equals(request.codigo())) {
            ultimoCodigo.incrementarTentativas();
            codigoRepository.save(ultimoCodigo);
            throw new BusinessRuleException("Código de autenticação inválido.");
        }

        String tokenGerado = UUID.randomUUID().toString();
        return new TokenResponse(tokenGerado, UsuarioResponse.fromEntity(usuario));
    }
}

