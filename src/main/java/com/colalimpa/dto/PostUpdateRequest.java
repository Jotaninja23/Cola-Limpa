package com.colalimpa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostUpdateRequest(
        @NotBlank @Size(max = 150) String titulo,
        @NotBlank String texto,
        @NotBlank @Size(max = 60) String categoria,
        @NotBlank @Size(max = 60) String materia
) {
}

