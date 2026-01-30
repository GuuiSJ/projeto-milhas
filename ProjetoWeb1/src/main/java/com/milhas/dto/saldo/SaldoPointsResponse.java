package com.milhas.dto.saldo;

import java.math.BigDecimal;

public record SaldoPointsResponse(
    Long id,
    String nomePrograma,
    BigDecimal totalPontos
) {}
