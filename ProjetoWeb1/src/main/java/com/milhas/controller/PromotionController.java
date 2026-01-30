package com.milhas.controller;

import com.milhas.dto.promotion.PromotionRequest;
import com.milhas.dto.promotion.PromotionResponse;
import com.milhas.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promocoes")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    public ResponseEntity<List<PromotionResponse>> listar() {
        return ResponseEntity.ok(promotionService.listarAtivas());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionResponse> salvar(@Valid @RequestBody PromotionRequest dto){
        return ResponseEntity.ok(promotionService.criarPromocao(dto));
    }
}
