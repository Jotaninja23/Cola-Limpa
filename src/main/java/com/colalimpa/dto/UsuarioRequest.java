package com.colalimpa.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
        @NotBlank @Size(max = 120) String nome,
        @Email @Size(max = 150) String email,
        @Size(max = 20) String telefone,
        String fotoUrl,
        @PositiveOrZero Integer metaDiariaMinutos
) {
}

