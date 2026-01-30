package com.milhas.dto.usuario;

import java.time.LocalDateTime;

public record UsuarioResponse(
    Long id,
    String nome,
    String email
) {}
