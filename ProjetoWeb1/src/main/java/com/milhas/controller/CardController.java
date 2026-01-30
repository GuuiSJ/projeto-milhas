package com.milhas.controller;

import com.milhas.dto.card.CardRequest;
import com.milhas.dto.card.CardResponse;
import com.milhas.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cartoes")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping
    public ResponseEntity<CardResponse> criar(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CardRequest dto) {

        CardResponse response = cardService.criarCartao(dto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CardResponse>> listar(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(cardService.listarCartoes(userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        cardService.excluirCartao(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
