package com.milhas.service.impl;

import com.milhas.dto.card.CardRequest;
import com.milhas.dto.card.CardResponse;
import com.milhas.entity.FlagEntity;
import com.milhas.entity.CardEntity;
import com.milhas.entity.ProgPontosEntity;
import com.milhas.entity.UsuarioEntity;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.FlagRepository;
import com.milhas.repository.CardRepository;
import com.milhas.repository.ProgPontosRepository;
import com.milhas.repository.UsuarioRepository;
import com.milhas.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final UsuarioRepository usuarioRepository;
    private final FlagRepository flagRepository;
    private final ProgPontosRepository progPontosRepository;

    @Override
    @Transactional
    public CardResponse criarCartao(CardRequest dto, String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findEntityByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        FlagEntity bandeira = flagRepository.findById(dto.bandeiraId())
                .orElseThrow(() -> new ResourceNotFoundException("Bandeira não encontrada."));
        ProgPontosEntity programa = progPontosRepository.findById(dto.progPontosId())
                .orElseThrow(() -> new ResourceNotFoundException("Programa de pontos não encontrado."));

        CardEntity cartao = new CardEntity();
        cartao.setUsuario(usuario);
        cartao.setNomePersonalizado(dto.nomePersonalizado());
        cartao.setUltimosDigitos(dto.ultimosDigitos());
        cartao.setFatorConversao(dto.fatorConversao());
        cartao.setBandeira(bandeira);
        cartao.setProgPontos(programa);

        CardEntity salvo = cardRepository.save(cartao);
        return mapToDTO(salvo);
    }

    @Override
    public List<CardResponse> listarCartoes(String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findEntityByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        return cardRepository.findByUsuarioId(usuario.getId()).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    @Transactional
    public void excluirCartao(Long idCartao, String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findEntityByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        CardEntity cartao = cardRepository.findById(idCartao)
                .orElseThrow(() -> new ResourceNotFoundException("Cartão não encontrado."));

        if (!cartao.getUsuario().getId().equals(usuario.getId())) {
            throw new ResourceNotFoundException("Cartão não encontrado para este usuário.");
        }
        cardRepository.delete(cartao);
    }

    private CardResponse mapToDTO(CardEntity entity) {
        return new CardResponse(
                entity.getId(),
                entity.getNomePersonalizado(),
                entity.getUltimosDigitos(),
                entity.getFatorConversao(),
                entity.getBandeira().getNome(),
                entity.getProgPontos().getNome()
        );
    }
}