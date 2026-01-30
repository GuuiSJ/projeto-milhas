package com.milhas.service;

import com.milhas.dto.promotion.PromotionRequest;
import com.milhas.dto.promotion.PromotionResponse;
import java.util.List;

public interface PromotionService {

    List<PromotionResponse> listarAtivas();

    PromotionResponse criarPromocao(PromotionRequest dto);
}
