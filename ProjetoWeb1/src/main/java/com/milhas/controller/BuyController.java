package com.milhas.controller;

import com.milhas.dto.buy.BuyRequest;
import com.milhas.dto.buy.BuyResponse;
import com.milhas.service.BuyService;
import com.milhas.service.FileUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/compras")
@RequiredArgsConstructor
public class BuyController {

    private final BuyService buyService;
    private final FileUploadService fileUploadService;

    @PostMapping
    public ResponseEntity<BuyResponse> registrarCompra(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BuyRequest dto) {

        BuyResponse response = buyService.registrarCompra(dto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{compraId}/upload-comprovante")
    public ResponseEntity<Void> uploadComprovante(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long compraId,
            @RequestParam("arquivo") MultipartFile arquivo) {

        fileUploadService.armazenarComprovante(arquivo, compraId, userDetails.getUsername());
        return ResponseEntity.accepted().build();
    }
}
