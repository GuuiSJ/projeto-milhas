package com.milhas.dto.dashboard;

import java.math.BigDecimal;

public record PointsForCardDTO(
        Long cartaoId,
        String nomeCartao,
        BigDecimal totalPontos
) {
}
