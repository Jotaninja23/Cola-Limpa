package com.colalimpa.dto;

import com.colalimpa.model.Comentario;
import java.time.LocalDateTime;

public record ComentarioResponse(
        Long id,
        Long postId,
        Long usuarioId,
        String usuarioNome,
        String usuarioFotoUrl,
        String texto,
        Integer qtCurtidas,
        Integer qtDenuncias,
        LocalDateTime dataCriacao
) {
    public static ComentarioResponse fromEntity(Comentario comentario) {
        return new ComentarioResponse(
                comentario.getId(),
                comentario.getPost().getId(),
                comentario.getUsuario().getId(),
                comentario.getUsuario().getNome(),
                comentario.getUsuario().getFotoUrl(),
                comentario.getTexto(),
                comentario.getQtCurtidas(),
                comentario.getQtDenuncias(),
                comentario.getDataCriacao()
        );
    }
}

