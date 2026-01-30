package com.milhas.controller;

import com.milhas.dto.notification.NotificationResponse;
import com.milhas.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notificacoes")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> listarMinhas(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificationService.listarMinhasNotificacoes(userDetails.getUsername()));
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<Void> marcarComoLida(
                                                @PathVariable Long id,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.marcarComoLida(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
