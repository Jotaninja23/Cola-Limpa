package com.colalimpa.security;

import static org.assertj.core.api.Assertions.assertThat;

import com.colalimpa.model.Usuario;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

class JwtServiceTest {

    private JwtService jwtService;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                "colalimpa-super-secret-key-that-has-at-least-256-bits-length-security!",
                86400000L
        );

        usuario = new Usuario("Aluno Teste", "aluno@email.com", null, null, null);
        usuario.setId(10L);
        usuario.setIsAdmin(false);
    }

    @Test
    void shouldGenerateValidTokenWithExpectedClaims() {
        String token = jwtService.gerarToken(usuario);

        assertThat(token).isNotBlank();
        assertThat(jwtService.extrairEmail(token)).isEqualTo("aluno@email.com");
        assertThat(jwtService.extrairUsuarioId(token)).isEqualTo(10L);

        Claims claims = jwtService.extrairClaims(token);
        assertThat(claims.get("nome")).isEqualTo("Aluno Teste");
        assertThat(claims.get("isAdmin")).isEqualTo(false);
    }

    @Test
    void shouldIncludeAdminRoleWhenUserIsAdmin() {
        usuario.setIsAdmin(true);
        String token = jwtService.gerarToken(usuario);

        Claims claims = jwtService.extrairClaims(token);
        assertThat(claims.get("isAdmin")).isEqualTo(true);
    }

    @Test
    void shouldValidateTokenAgainstUserDetails() {
        String token = jwtService.gerarToken(usuario);
        UserDetails principal = UsuarioPrincipal.fromEntity(usuario);

        assertThat(jwtService.isTokenValido(token, principal)).isTrue();
    }

    @Test
    void shouldRejectTokenWhenUserEmailDoesNotMatch() {
        String token = jwtService.gerarToken(usuario);

        Usuario outro = new Usuario("Outro", "outro@email.com", null, null, null);
        outro.setId(20L);
        UserDetails outroPrincipal = UsuarioPrincipal.fromEntity(outro);

        assertThat(jwtService.isTokenValido(token, outroPrincipal)).isFalse();
    }

    @Test
    void shouldDetectExpiredToken() {
        JwtService shortLivedJwtService = new JwtService(
                "colalimpa-super-secret-key-that-has-at-least-256-bits-length-security!",
                -1000L
        );

        String expiredToken = shortLivedJwtService.gerarToken(usuario);
        assertThat(jwtService.isTokenValido(expiredToken)).isFalse();
    }

    @Test
    void shouldRejectTokenSignedWithDifferentSecret() {
        JwtService differentSecretJwtService = new JwtService(
                "another-completely-different-secret-key-that-has-256-bits-length!!",
                86400000L
        );

        String rogueToken = differentSecretJwtService.gerarToken(usuario);
        assertThat(jwtService.isTokenValido(rogueToken)).isFalse();
    }
}

