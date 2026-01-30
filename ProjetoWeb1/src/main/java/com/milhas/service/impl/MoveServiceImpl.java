package com.milhas.service.impl;

import com.milhas.dto.move.MovePointsResponse;
import com.milhas.entity.BuyEntity;
import com.milhas.entity.MovePointsEntity;
import com.milhas.entity.SaldoPointsEntity;
import com.milhas.entity.UsuarioEntity;
import com.milhas.entity.enums.MoveType;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.MovePointsRepository;
import com.milhas.repository.UsuarioRepository;
import com.milhas.service.MoveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MoveServiceImpl implements MoveService {

    private final MovePointsRepository moveRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public void registrarMovimentacao(SaldoPointsEntity saldo, MoveType tipo, BigDecimal quantidade, String descricao, BuyEntity compraOrigem) {

        MovePointsEntity mov = new MovePointsEntity();
        mov.setSaldoPontos(saldo);
        mov.setTipo(tipo);
        mov.setQuantidadePontos(quantidade);
        mov.setDescricao(descricao);
        mov.setDataMovimentacao(LocalDateTime.now());
        mov.setCompra(compraOrigem);

        moveRepository.save(mov);
    }

    @Override
    public List<MovePointsResponse> listarMovimentacoes(String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findEntityByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        return moveRepository.findBySaldoPontosUsuarioId(usuario.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private MovePointsResponse mapToDTO(MovePointsEntity mov) {
        return new MovePointsResponse(
                mov.getId(),
                mov.getTipo(),
                mov.getQuantidadePontos(),
                mov.getDataMovimentacao(),
                mov.getDescricao(),
                mov.getSaldoPontos().getProgPontos().getNome()
        );
    }
}
