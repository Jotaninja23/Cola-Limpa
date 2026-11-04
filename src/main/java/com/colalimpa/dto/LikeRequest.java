package com.colalimpa.dto;

import jakarta.validation.constraints.NotNull;

public record LikeRequest(
        @NotNull Long usuarioId,
        Long postId,
        Long comentarioId
) {
}

