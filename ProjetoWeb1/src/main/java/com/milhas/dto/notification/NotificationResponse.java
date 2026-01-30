package com.milhas.dto.notification;

import com.milhas.entity.enums.NotificationType;
import java.time.LocalDateTime;

public record NotificationResponse(
    Long id,
    String mensagem,
    boolean lida,
    NotificationType tipo,
    LocalDateTime dataEnvio
) {}
