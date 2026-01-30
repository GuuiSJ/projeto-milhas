package com.milhas.service;

import com.milhas.dto.card.CardRequest;
import com.milhas.dto.card.CardResponse;
import java.util.List;

public interface CardService {
    CardResponse criarCartao(CardRequest dto, String emailUsuario);
    List<CardResponse> listarCartoes(String emailUsuario);
    void excluirCartao(Long idCartao, String emailUsuario);
}
