package com.milhas.service.impl;

import com.milhas.dto.buy.BuyRequest;
import com.milhas.dto.buy.BuyResponse;
import com.milhas.entity.CardEntity;
import com.milhas.entity.BuyEntity;
import com.milhas.entity.UsuarioEntity;
import com.milhas.entity.enums.BuyStatus;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.CardRepository;
import com.milhas.repository.BuyRepository;
import com.milhas.repository.UsuarioRepository;
import com.milhas.service.BuyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class BuyServiceImpl implements BuyService {

    private final BuyRepository buyRepository;
    private final CardRepository cardRepository;
    private final UsuarioRepository usuarioRepository;
    private static final int PRAZO_CREDITO_DIAS = 30;

    @Override
    @Transactional
    public BuyResponse registrarCompra(BuyRequest dto, String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findEntityByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        CardEntity cartao = cardRepository.findById(dto.cartaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Cartão não encontrado."));

        if (!cartao.getUsuario().getId().equals(usuario.getId())) {
            throw new ResourceNotFoundException("Cartão não pertence ao usuário.");
        }

        BigDecimal pontosCalculados = dto.valorGasto().multiply(cartao.getFatorConversao());
        LocalDate dataCreditoPrevista = dto.dataCompra().plusDays(PRAZO_CREDITO_DIAS);

        BuyEntity compra = new BuyEntity();
        compra.setDescricao(dto.descricao());
        compra.setValorGasto(dto.valorGasto());
        compra.setDataCompra(dto.dataCompra());
        compra.setCartao(cartao);
        compra.setPontosCalculados(pontosCalculados);
        compra.setDataCreditoPrevista(dataCreditoPrevista);
        compra.setStatus(BuyStatus.PENDENTE);

        BuyEntity compraSalva = buyRepository.save(compra);
        return mapToDTO(compraSalva);
    }

    private BuyResponse mapToDTO(BuyEntity entity) {
        Integer diasParaCredito = null;

        if (entity.getStatus() == BuyStatus.PENDENTE) {
            LocalDate hoje = LocalDate.now();
            LocalDate dataPrevista = entity.getDataCreditoPrevista();

            if (dataPrevista != null) {
                long dias = ChronoUnit.DAYS.between(hoje, dataPrevista);
                diasParaCredito = (int) Math.max(0, dias);
            }
        }

        return new BuyResponse(
                entity.getId(),
                entity.getDescricao(),
                entity.getValorGasto(),
                entity.getPontosCalculados(),
                entity.getDataCompra(),
                entity.getDataCreditoPrevista(),
                entity.getStatus(),
                entity.getCartao().getId(),
                entity.getCartao().getNomePersonalizado(),
                diasParaCredito
        );
    }
}
