package com.colalimpa.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.colalimpa.dto.TokenResponse;
import com.colalimpa.dto.ValidarCodigoRequest;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.model.CodigoAutenticacao;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.CodigoAutenticacaoRepository;
import com.colalimpa.repository.UsuarioRepository;
import com.colalimpa.security.JwtService;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuthServiceSecurityTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private CodigoAutenticacaoRepository codigoRepository;

    @Mock
    private EmailSenderService emailSenderService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno", "aluno@email.com", null, null, null);
        usuario.setId(1L);
    }

    @Test
    void shouldPreventReplayAttackWhenOtpAlreadyUsed() {
        ValidarCodigoRequest request = new ValidarCodigoRequest("aluno@email.com", "123456");

        CodigoAutenticacao codigoJaUsado = new CodigoAutenticacao(usuario, "123456", "EMAIL", LocalDateTime.now().plusMinutes(5));
        codigoJaUsado.marcarComoUtilizado();

        when(usuarioRepository.findByEmail("aluno@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(Optional.of(codigoJaUsado));

        assertThatThrownBy(() -> authService.validarCodigo(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Código de autenticação expirado ou já utilizado.");
    }

    @Test
    void shouldBlockOtpWhenThreeFailedAttemptsReached() {
        ValidarCodigoRequest request = new ValidarCodigoRequest("aluno@email.com", "123456");

        CodigoAutenticacao codigoBloqueado = new CodigoAutenticacao(usuario, "123456", "EMAIL", LocalDateTime.now().plusMinutes(5));
        codigoBloqueado.setTentativasEnvio(3);

        when(usuarioRepository.findByEmail("aluno@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(Optional.of(codigoBloqueado));

        assertThatThrownBy(() -> authService.validarCodigo(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Código bloqueado por excesso de tentativas incorretas.");
    }

    @Test
    void shouldMarkOtpAsUsedAndReturnJwtUponSuccess() {
        ValidarCodigoRequest request = new ValidarCodigoRequest("aluno@email.com", "654321");

        CodigoAutenticacao codigoValido = new CodigoAutenticacao(usuario, "654321", "EMAIL", LocalDateTime.now().plusMinutes(5));

        when(usuarioRepository.findByEmail("aluno@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(Optional.of(codigoValido));
        when(jwtService.gerarToken(usuario)).thenReturn("jwt.token.signed");

        TokenResponse response = authService.validarCodigo(request);

        assertThat(response.token()).isEqualTo("jwt.token.signed");
        assertThat(codigoValido.isUtilizado()).isTrue();
        verify(codigoRepository).save(codigoValido);
    }
}

