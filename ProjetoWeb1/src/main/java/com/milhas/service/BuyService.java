package com.milhas.service;

import com.milhas.dto.buy.BuyRequest;
import com.milhas.dto.buy.BuyResponse;

public interface BuyService {
    BuyResponse registrarCompra(BuyRequest dto, String emailUsuario);
}
