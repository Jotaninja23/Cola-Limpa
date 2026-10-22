package com.colalimpa.dto;

public record TokenResponse(
        String token,
        UsuarioResponse usuario
) {
}

