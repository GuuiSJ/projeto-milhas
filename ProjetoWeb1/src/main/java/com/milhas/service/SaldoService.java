package com.milhas.service;

import com.milhas.dto.saldo.SaldoPointsResponse;
import com.milhas.entity.BuyEntity;
import java.util.List;

public interface SaldoService {


    List<SaldoPointsResponse> consultarSaldos(String emailUsuario);

    void creditarPontosCompra(BuyEntity compra);
}
