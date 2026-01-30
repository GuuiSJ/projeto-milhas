package com.milhas.dto.buy;

import com.milhas.entity.enums.BuyStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public record BuyResponse(
    Long id,
    String descricao,
    BigDecimal valorGasto,
    BigDecimal pontosCalculados,
    LocalDate dataCompra,
    LocalDate dataCreditoPrevista,
    BuyStatus status,
    Long cartaoId,
    String nomeCartao,
    Integer diasParaCredito
) {}
