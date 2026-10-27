package com.colalimpa.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.colalimpa.dto.SolicitarCodigoRequest;
import com.colalimpa.dto.TokenResponse;
import com.colalimpa.dto.ValidarCodigoRequest;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.model.CodigoAutenticacao;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.CodigoAutenticacaoRepository;
import com.colalimpa.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private CodigoAutenticacaoRepository codigoRepository;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("estudante", "estudante@email.com", null, null, null);
        usuario.setId(1L);
    }

    @Test
    void shouldGenerateOtpSuccessfullyWhenWithinLimits() {
        SolicitarCodigoRequest request = new SolicitarCodigoRequest("estudante@email.com");

        when(usuarioRepository.findByEmail("estudante@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.countByUsuarioIdAndDataCriacaoAfter(any(), any())).thenReturn(0L);
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(Optional.empty());

        authService.solicitarCodigo(request);

        verify(codigoRepository).save(any(CodigoAutenticacao.class));
    }

    @Test
    void shouldCreateNewUserWhenEmailNotFoundDuringOtpRequest() {
        SolicitarCodigoRequest request = new SolicitarCodigoRequest("novato@email.com");
        Usuario novoUsuario = new Usuario("novato", "novato@email.com", null, null, null);
        novoUsuario.setId(2L);

        when(usuarioRepository.findByEmail("novato@email.com")).thenReturn(Optional.empty());
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(novoUsuario);
        when(codigoRepository.countByUsuarioIdAndDataCriacaoAfter(any(), any())).thenReturn(0L);
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(2L)).thenReturn(Optional.empty());

        authService.solicitarCodigo(request);

        verify(usuarioRepository).save(any(Usuario.class));
        verify(codigoRepository).save(any(CodigoAutenticacao.class));
    }

    @Test
    void shouldThrowExceptionWhenDailyOtpLimitReached() {
        SolicitarCodigoRequest request = new SolicitarCodigoRequest("estudante@email.com");

        when(usuarioRepository.findByEmail("estudante@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.countByUsuarioIdAndDataCriacaoAfter(any(), any())).thenReturn(4L);

        assertThatThrownBy(() -> authService.solicitarCodigo(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Limite diário de envio de códigos atingido.");
    }

    @Test
    void shouldThrowExceptionWhenResendingWithin30Seconds() {
        SolicitarCodigoRequest request = new SolicitarCodigoRequest("estudante@email.com");

        CodigoAutenticacao recente = new CodigoAutenticacao(usuario, "123456", "EMAIL", LocalDateTime.now().plusMinutes(5));
        recente.setDataCriacao(LocalDateTime.now().minusSeconds(10));

        when(usuarioRepository.findByEmail("estudante@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.countByUsuarioIdAndDataCriacaoAfter(any(), any())).thenReturn(1L);
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(Optional.of(recente));

        assertThatThrownBy(() -> authService.solicitarCodigo(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Aguarde ao menos 30 segundos antes de solicitar um novo código.");
    }

    @Test
    void shouldValidateOtpSuccessfully() {
        ValidarCodigoRequest request = new ValidarCodigoRequest("estudante@email.com", "123456");

        CodigoAutenticacao codigoAtivo = new CodigoAutenticacao(usuario, "123456", "EMAIL", LocalDateTime.now().plusMinutes(5));

        when(usuarioRepository.findByEmail("estudante@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(Optional.of(codigoAtivo));

        TokenResponse tokenResponse = authService.validarCodigo(request);

        assertThat(tokenResponse).isNotNull();
        assertThat(tokenResponse.token()).isNotBlank();
        assertThat(tokenResponse.usuario().email()).isEqualTo("estudante@email.com");
    }

    @Test
    void shouldThrowExceptionWhenUserNotFoundDuringValidation() {
        ValidarCodigoRequest request = new ValidarCodigoRequest("naoexiste@email.com", "123456");

        when(usuarioRepository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.validarCodigo(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado para o e-mail informado.");
    }

    @Test
    void shouldThrowExceptionWhenNoActiveOtpExists() {
        ValidarCodigoRequest request = new ValidarCodigoRequest("estudante@email.com", "123456");

        when(usuarioRepository.findByEmail("estudante@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.validarCodigo(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Nenhum código ativo encontrado para este e-mail.");
    }

    @Test
    void shouldThrowExceptionWhenOtpIsExpired() {
        ValidarCodigoRequest request = new ValidarCodigoRequest("estudante@email.com", "123456");

        CodigoAutenticacao expirado = new CodigoAutenticacao(usuario, "123456", "EMAIL", LocalDateTime.now().minusMinutes(1));

        when(usuarioRepository.findByEmail("estudante@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(Optional.of(expirado));

        assertThatThrownBy(() -> authService.validarCodigo(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O código informado expirou.");
    }

    @Test
    void shouldThrowExceptionAndIncrementAttemptsWhenOtpIsIncorrect() {
        ValidarCodigoRequest request = new ValidarCodigoRequest("estudante@email.com", "999999");

        CodigoAutenticacao codigoAtivo = new CodigoAutenticacao(usuario, "123456", "EMAIL", LocalDateTime.now().plusMinutes(5));

        when(usuarioRepository.findByEmail("estudante@email.com")).thenReturn(Optional.of(usuario));
        when(codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(Optional.of(codigoAtivo));

        assertThatThrownBy(() -> authService.validarCodigo(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Código de autenticação inválido.");

        assertThat(codigoAtivo.getTentativasEnvio()).isEqualTo(1);
        verify(codigoRepository).save(codigoAtivo);
    }
}
