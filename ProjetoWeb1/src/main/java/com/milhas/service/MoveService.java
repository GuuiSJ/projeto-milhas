package com.milhas.service;

import com.milhas.dto.move.MovePointsResponse;
import com.milhas.entity.BuyEntity;
import com.milhas.entity.SaldoPointsEntity;
import com.milhas.entity.enums.MoveType;

import java.math.BigDecimal;
import java.util.List;

public interface MoveService {


    void registrarMovimentacao(
            SaldoPointsEntity saldo,
            MoveType tipo,
            BigDecimal quantidade,
            String descricao,
            BuyEntity compraOrigem
    );


    List<MovePointsResponse> listarMovimentacoes(String emailUsuario);
}
