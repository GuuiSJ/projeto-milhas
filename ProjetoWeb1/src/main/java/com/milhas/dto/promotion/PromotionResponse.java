package com.milhas.dto.promotion;

import java.time.LocalDate;

public record PromotionResponse(
        Long id,
        String titulo,
        String descricao,
        String urlPromocao,
        LocalDate dataInicio,
        LocalDate dataFim,
        String nomeProgramaPontos
) {}
