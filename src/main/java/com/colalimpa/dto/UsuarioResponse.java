package com.colalimpa.dto;

import com.colalimpa.model.Usuario;
import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        String fotoUrl,
        Integer xp,
        Integer metaDiariaMinutos,
        Boolean isAdmin,
        LocalDateTime dataCriacao
) {
    public static UsuarioResponse fromEntity(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getFotoUrl(),
                usuario.getXp(),
                usuario.getMetaDiariaMinutos(),
                usuario.getIsAdmin(),
                usuario.getDataCriacao()
        );
    }
}

