package com.colalimpa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ComentarioRequest(
        @NotNull Long postId,
        @NotNull Long usuarioId,
        @NotBlank String texto
) {
}

