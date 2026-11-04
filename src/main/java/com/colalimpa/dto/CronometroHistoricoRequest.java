package com.colalimpa.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CronometroHistoricoRequest(
        @NotNull Long usuarioId,
        @NotNull @Positive @Max(57600) Integer tempoSegundos,
        @NotBlank String tipoSessao
) {
}

