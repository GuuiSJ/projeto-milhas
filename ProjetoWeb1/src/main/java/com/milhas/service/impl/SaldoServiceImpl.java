package com.milhas.service.impl;

import com.milhas.dto.saldo.SaldoPointsResponse;
import com.milhas.entity.BuyEntity;
import com.milhas.entity.ProgPontosEntity;
import com.milhas.entity.SaldoPointsEntity;
import com.milhas.entity.UsuarioEntity;
import com.milhas.entity.enums.MoveType;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.SaldoPointsRepository;
import com.milhas.repository.UsuarioRepository;
import com.milhas.service.MoveService;
import com.milhas.service.SaldoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaldoServiceImpl implements SaldoService {

    private final SaldoPointsRepository saldoPointsRepository;
    private final UsuarioRepository usuarioRepository;
    private final MoveService moveService;

    @Override
    public List<SaldoPointsResponse> consultarSaldos(String emailUsuario) {
        UsuarioEntity usuario = findUsuarioByEmail(emailUsuario);

        return saldoPointsRepository.findByUsuarioId(usuario.getId()).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    @Transactional
    public void creditarPontosCompra(BuyEntity compra) {
        if (compra.getPontosCalculados() == null || compra.getPontosCalculados().compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        UsuarioEntity usuario = compra.getCartao().getUsuario();
        ProgPontosEntity programa = compra.getCartao().getProgPontos();

        SaldoPointsEntity saldo = saldoPointsRepository.findByUsuarioIdAndProgPontosId(usuario.getId(), programa.getId())
                .orElseGet(() -> criarNovoSaldo(usuario, programa));

        saldo.setTotalPontos(saldo.getTotalPontos().add(compra.getPontosCalculados()));
        SaldoPointsEntity saldoSalvo = saldoPointsRepository.save(saldo);

        moveService.registrarMovimentacao(
                saldoSalvo,
                MoveType.ACUMULO,
                compra.getPontosCalculados(),
                "Crédito da compra: " + compra.getDescricao(),
                compra
        );
    }

    private SaldoPointsEntity criarNovoSaldo(UsuarioEntity usuario, ProgPontosEntity programa) {
        SaldoPointsEntity novoSaldo = new SaldoPointsEntity();
        novoSaldo.setUsuario(usuario);
        novoSaldo.setProgPontos(programa);
        novoSaldo.setTotalPontos(BigDecimal.ZERO);
        return novoSaldo;
    }

    private UsuarioEntity findUsuarioByEmail(String email) {
        return usuarioRepository.findEntityByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    private SaldoPointsResponse mapToDTO(SaldoPointsEntity entity) {
        return new SaldoPointsResponse(
                entity.getId(),
                entity.getProgPontos().getNome(),
                entity.getTotalPontos()
        );
    }
}
