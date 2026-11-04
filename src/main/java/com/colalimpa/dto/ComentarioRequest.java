package com.colalimpa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ComentarioRequest(
        @NotNull Long postId,
        @NotNull Long usuarioId,
        @NotBlank @Size(min = 1, max = 1000) String texto
) {
}

