package com.milhas.service;

import com.milhas.dto.notification.NotificationResponse;
import com.milhas.entity.BuyEntity;
import com.milhas.entity.UsuarioEntity;

import com.milhas.entity.enums.NotificationType;


import java.util.List;

public interface NotificationService {


    List<NotificationResponse> listarMinhasNotificacoes(String emailUsuario);

    void criarNotificacao(UsuarioEntity destinatario, String mensagem, NotificationType tipo, BuyEntity compraRelacionada);

    void notificarTodos(String mensagem, NotificationType tipo);

    void marcarComoLida(Long idNotificacao, String emailUsuario);
}
