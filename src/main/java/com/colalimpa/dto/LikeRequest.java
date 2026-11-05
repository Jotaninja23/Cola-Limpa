package com.colalimpa.dto;

public record LikeRequest(
        Long usuarioId,
        Long postId,
        Long comentarioId
) {
}

