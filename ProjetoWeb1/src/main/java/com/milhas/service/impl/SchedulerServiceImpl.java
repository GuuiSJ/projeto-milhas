package com.milhas.service.impl;

import com.milhas.entity.BuyEntity;
import com.milhas.entity.enums.BuyStatus;
import com.milhas.entity.enums.NotificationType;
import com.milhas.repository.BuyRepository;
import com.milhas.service.NotificationService; // Importa a INTERFACE
import com.milhas.service.SaldoService;     // Importa a INTERFACE
import com.milhas.service.SchedulerService;  // Importa a INTERFACE
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulerServiceImpl implements SchedulerService {

    private final BuyRepository buyRepository;
    private final NotificationService notificationService;
    private final SaldoService saldoService;

    private static final Logger log = LoggerFactory.getLogger(SchedulerServiceImpl.class);

    @Override
    @Scheduled(cron = "0 0 8 * * *")

    @Transactional
    public void verificarComprasVencidas() {
        log.info("Iniciando verificação agendada de compras vencidas...");

        LocalDate hoje = LocalDate.now();
        List<BuyEntity> comprasVencidas = buyRepository
                .findByStatusAndDataCreditoPrevistaBefore(BuyStatus.PENDENTE, hoje);

        if (comprasVencidas.isEmpty()) {
            log.info("Nenhuma compra pendente vencida encontrada.");
            return;
        }

        log.info("Encontradas {} compras vencidas. Processando...", comprasVencidas.size());

        for (BuyEntity compra : comprasVencidas) {
            boolean simularSucesso = Math.random() > 0.2;

            if (simularSucesso) {
                compra.setStatus(BuyStatus.CREDITADO);

                saldoService.creditarPontosCompra(compra);

                notificationService.criarNotificacao(
                        compra.getCartao().getUsuario(),
                        "Seus pontos da compra '" + compra.getDescricao() + "' foram creditados com sucesso!",
                        NotificationType.CREDITO_REALIZADO,
                        compra
                );
                log.info("Compra ID {} atualizada para CREDITADO.", compra.getId());
            } else {
                compra.setStatus(BuyStatus.EXPIRADO);
                notificationService.criarNotificacao(
                        compra.getCartao().getUsuario(),
                        "ATENÇÃO: O prazo de crédito da compra '" + compra.getDescricao() + "' expirou. Verifique com a central.",
                        NotificationType.EXPIRACAO_PRAZO,
                        compra
                );
                log.warn("Compra ID {} atualizada para EXPIRADO.", compra.getId());
            }

            buyRepository.save(compra);
        }

        log.info("Verificação agendada concluída.");
    }
}
