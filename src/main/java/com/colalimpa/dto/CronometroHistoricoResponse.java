package com.colalimpa.dto;

import com.colalimpa.model.CronometroHistorico;
import java.time.LocalDateTime;

public record CronometroHistoricoResponse(
        Long id,
        Long usuarioId,
        Integer tempoSegundos,
        String tipoSessao,
        Integer xpGanho,
        LocalDateTime dataCriacao
) {
    public static CronometroHistoricoResponse fromEntity(CronometroHistorico historico, Integer xpGanho) {
        return new CronometroHistoricoResponse(
                historico.getId(),
                historico.getUsuario().getId(),
                historico.getTempoSegundos(),
                historico.getTipoSessao(),
                xpGanho,
                historico.getDataCriacao()
        );
    }
}

