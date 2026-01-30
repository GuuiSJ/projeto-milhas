package com.milhas.dto.card;

import java.math.BigDecimal;

public record CardResponse(
    Long id,
    String nomePersonalizado,
    String ultimosDigitos,
    BigDecimal fatorConversao,
    String nomeBandeira,
    String nomeProgramaPontos
) {}
