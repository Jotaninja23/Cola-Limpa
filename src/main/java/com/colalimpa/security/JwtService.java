package com.colalimpa.security;

import com.colalimpa.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final String secret;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret:colalimpa-super-secret-key-that-has-at-least-256-bits-length-security!}") String secret,
            @Value("${jwt.expiration-ms:86400000}") long expirationMs
    ) {
        this.secret = secret;
        this.expirationMs = expirationMs;
    }

    public String gerarToken(Usuario usuario) {
        List<String> roles = Boolean.TRUE.equals(usuario.getIsAdmin())
                ? List.of("ROLE_USER", "ROLE_ADMIN")
                : List.of("ROLE_USER");

        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expirationMs);

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("userId", usuario.getId())
                .claim("nome", usuario.getNome())
                .claim("isAdmin", Boolean.TRUE.equals(usuario.getIsAdmin()))
                .claim("roles", roles)
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String extrairEmail(String token) {
        return extrairClaims(token).getSubject();
    }

    public Long extrairUsuarioId(String token) {
        Object userIdClaim = extrairClaims(token).get("userId");
        if (userIdClaim instanceof Number number) {
            return number.longValue();
        }
        return null;
    }

    public boolean isTokenValido(String token, UserDetails userDetails) {
        try {
            Claims claims = extrairClaims(token);
            String email = claims.getSubject();
            boolean isNaoExpirado = claims.getExpiration().after(new Date());
            return email != null && email.equalsIgnoreCase(userDetails.getUsername()) && isNaoExpirado;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isTokenValido(String token) {
        try {
            Claims claims = extrairClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Claims extrairClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = this.secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

