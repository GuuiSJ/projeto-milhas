package com.milhas.dto.move;

import com.milhas.entity.enums.MoveType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovePointsResponse(
    Long id,
    MoveType tipo,
    BigDecimal quantidadePontos,
    LocalDateTime dataMovimentacao,
    String descricao,
    String nomePrograma
) {}
