package com.colalimpa.dto;

import com.colalimpa.model.Post;
import java.time.LocalDateTime;

public record PostResponse(
        Long id,
        Long usuarioId,
        String usuarioNome,
        String usuarioFotoUrl,
        String titulo,
        String texto,
        String categoria,
        String materia,
        Integer qtCurtidas,
        Integer qtDenuncias,
        LocalDateTime dataCriacao
) {
    public static PostResponse fromEntity(Post post) {
        return new PostResponse(
                post.getId(),
                post.getUsuario().getId(),
                post.getUsuario().getNome(),
                post.getUsuario().getFotoUrl(),
                post.getTitulo(),
                post.getTexto(),
                post.getCategoria(),
                post.getMateria(),
                post.getQtCurtidas(),
                post.getQtDenuncias(),
                post.getDataCriacao()
        );
    }
}

