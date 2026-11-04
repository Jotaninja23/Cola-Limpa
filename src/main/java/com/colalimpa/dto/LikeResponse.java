package com.colalimpa.dto;

import com.colalimpa.model.Like;
import java.time.LocalDateTime;

public record LikeResponse(
        Long id,
        Long usuarioId,
        Long postId,
        Long comentarioId,
        LocalDateTime dataCriacao
) {
    public static LikeResponse fromEntity(Like like) {
        return new LikeResponse(
                like.getId(),
                like.getUsuario().getId(),
                like.getPost() != null ? like.getPost().getId() : null,
                like.getComentario() != null ? like.getComentario().getId() : null,
                like.getDataCriacao()
        );
    }
}

