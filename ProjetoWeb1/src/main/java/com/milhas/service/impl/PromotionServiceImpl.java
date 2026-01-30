package com.milhas.service.impl;

import com.milhas.dto.promotion.PromotionRequest;
import com.milhas.dto.promotion.PromotionResponse;
import com.milhas.entity.ProgPontosEntity;
import com.milhas.entity.PromotionEntity;
import com.milhas.entity.enums.NotificationType;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.ProgPontosRepository;
import com.milhas.repository.PromotionRepository;
import com.milhas.service.NotificationService; // Importa a INTERFACE
import com.milhas.service.PromotionService; // Importa a INTERFACE
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final ProgPontosRepository progPontosRepository;
    private final NotificationService notificationService;

    @Override
    public List<PromotionResponse> listarAtivas() {

        return promotionRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    @Transactional
    public PromotionResponse criarPromocao(PromotionRequest dto) {
        ProgPontosEntity programa = progPontosRepository.findById(dto.progPontosId())
                .orElseThrow(() -> new ResourceNotFoundException("Programa de pontos não encontrado."));

        PromotionEntity promocao = new PromotionEntity();
        promocao.setTitulo(dto.titulo());
        promocao.setDescricao(dto.descricao());
        promocao.setUrlPromocao(dto.urlPromocao());
        promocao.setDataInicio(dto.dataInicio());
        promocao.setDataFim(dto.dataFim());
        promocao.setProgPontos(programa);

        PromotionEntity salva = promotionRepository.save(promocao);

        notificationService.notificarTodos(
                "Nova promoção no programa " + programa.getNome() + ": " + dto.titulo(),
                NotificationType.PROMOCAO
        );

        return mapToDTO(salva);
    }

    private PromotionResponse mapToDTO(PromotionEntity entity) {
        return new PromotionResponse(
                entity.getId(),
                entity.getTitulo(),
                entity.getDescricao(),
                entity.getUrlPromocao(),
                entity.getDataInicio(),
                entity.getDataFim(),
                entity.getProgPontos().getNome()
        );
    }
}
