package com.colalimpa.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.colalimpa.dto.GoogleLoginRequest;
import com.colalimpa.dto.SolicitarCodigoRequest;
import com.colalimpa.dto.TokenResponse;
import com.colalimpa.dto.UsuarioResponse;
import com.colalimpa.dto.ValidarCodigoRequest;
import com.colalimpa.service.AuthService;
import com.colalimpa.service.GoogleAuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = AuthController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private GoogleAuthService googleAuthService;

    @Test
    void shouldReturnOkWhenSolicitarCodigoIsValid() throws Exception {
        SolicitarCodigoRequest request = new SolicitarCodigoRequest("aluno@email.com");
        doNothing().when(authService).solicitarCodigo(any());

        mockMvc.perform(post("/api/auth/solicitar-codigo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturnBadRequestWhenSolicitarCodigoHasInvalidEmail() throws Exception {
        SolicitarCodigoRequest request = new SolicitarCodigoRequest("invalido");

        mockMvc.perform(post("/api/auth/solicitar-codigo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnTokenResponseWhenValidarCodigoIsValid() throws Exception {
        ValidarCodigoRequest request = new ValidarCodigoRequest("aluno@email.com", "123456");
        UsuarioResponse usuarioResponse = new UsuarioResponse(
                1L, "Aluno", "aluno@email.com", null, null, 0, 60, false, LocalDateTime.now()
        );
        TokenResponse tokenResponse = new TokenResponse("token-jwt-mock", usuarioResponse);

        when(authService.validarCodigo(any())).thenReturn(tokenResponse);

        mockMvc.perform(post("/api/auth/validar-codigo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token-jwt-mock"))
                .andExpect(jsonPath("$.usuario.email").value("aluno@email.com"));
    }

    @Test
    void shouldReturnBadRequestWhenValidarCodigoHasBlankCode() throws Exception {
        ValidarCodigoRequest request = new ValidarCodigoRequest("aluno@email.com", "");

        mockMvc.perform(post("/api/auth/validar-codigo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}

