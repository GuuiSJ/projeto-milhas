package com.milhas.dto.dashboard;

import java.util.List;

public record DashboardResponseDTO (
        List<PointsForCardDTO> pontosPorCartao,
        PrazoMedioReceberDTO prazoMedio
) { }

