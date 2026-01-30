package com.milhas.service.impl;

import com.milhas.dto.notification.NotificationResponse;
import com.milhas.entity.BuyEntity;
import com.milhas.entity.NotificationEntity;
import com.milhas.entity.UsuarioEntity;
import com.milhas.entity.enums.NotificationType;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.NotificationRepository;
import com.milhas.repository.UsuarioRepository;
import com.milhas.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public List<NotificationResponse> listarMinhasNotificacoes(String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findEntityByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        return notificationRepository.findByUsuarioIdOrderByDataEnvioDesc(usuario.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    @Transactional
    public void criarNotificacao(UsuarioEntity destinatario, String mensagem, NotificationType tipo, BuyEntity compraRelacionada) {
        NotificationEntity notificacao = new NotificationEntity();
        notificacao.setUsuario(destinatario);
        notificacao.setMensagem(mensagem);
        notificacao.setTipo(tipo);
        notificacao.setDataEnvio(LocalDateTime.now());
        notificacao.setLida(false);
        notificacao.setCompra(compraRelacionada);

        notificationRepository.save(notificacao);
    }

    @Override
    @Transactional
    public void notificarTodos(String mensagem, NotificationType tipo) {
        List<UsuarioEntity> todosUsuarios = usuarioRepository.findAll();
        todosUsuarios.forEach(usuario -> criarNotificacao(usuario, mensagem, tipo, null));
    }

    @Override
    @Transactional
    public void marcarComoLida(Long idNotificacao, String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findEntityByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        NotificationEntity notificacao = notificationRepository.findById(idNotificacao)
                .orElseThrow(() -> new ResourceNotFoundException("Notificação não encontrada."));

        if (!notificacao.getUsuario().getId().equals(usuario.getId())) {
            throw new ResourceNotFoundException("Notificação não encontrada para este usuário.");
        }

        notificacao.setLida(true);
        notificationRepository.save(notificacao);
    }

    private NotificationResponse mapToDTO(NotificationEntity entity) {
        return new NotificationResponse(
                entity.getId(),
                entity.getMensagem(),
                entity.isLida(),
                entity.getTipo(),
                entity.getDataEnvio()
        );
    }
}
