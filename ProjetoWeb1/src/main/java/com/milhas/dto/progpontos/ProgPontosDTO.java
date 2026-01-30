package com.milhas.dto.progpontos;

import jakarta.validation.constraints.NotBlank;

public record ProgPontosDTO(

        Long id,
        @NotBlank(message = "O nome do programa de pontos é obrigatório")
        String nome
) {
}
