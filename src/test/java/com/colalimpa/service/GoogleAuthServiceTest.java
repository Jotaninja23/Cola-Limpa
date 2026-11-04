package com.colalimpa.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.repository.UsuarioRepository;
import com.colalimpa.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GoogleAuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JwtService jwtService;

    private GoogleAuthService googleAuthService;

    @BeforeEach
    void setUp() {
        googleAuthService = new GoogleAuthService(usuarioRepository, jwtService, "test-client-id");
    }

    @Test
    void shouldThrowExceptionWhenGoogleIdTokenIsMalformedOrInvalid() {
        assertThatThrownBy(() -> googleAuthService.autenticarComGoogle("invalid.id.token"))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Falha ao autenticar com Google");
    }
}

