package com.milhas.service.impl;

import com.milhas.dto.progpontos.ProgPontosDTO;
import com.milhas.entity.ProgPontosEntity;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.ProgPontosRepository;
import com.milhas.service.ProgPontosService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgPontosServiceImpl implements ProgPontosService {

    private final ProgPontosRepository progPontosRepository;

    @Override
    public List<ProgPontosDTO> listarTodos() {
        return progPontosRepository.findAll().stream()
                .map(p -> new ProgPontosDTO(p.getId(), p.getNome()))
                .toList();
    }

    @Override
    @Transactional
    public ProgPontosDTO salvar(ProgPontosDTO dto) {
        ProgPontosEntity entity = new ProgPontosEntity();
        if (dto.id() != null) {
            entity = progPontosRepository.findById(dto.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Programa de pontos não encontrado."));
        }
        entity.setNome(dto.nome());
        ProgPontosEntity salvo = progPontosRepository.save(entity);
        return new ProgPontosDTO(salvo.getId(), salvo.getNome());
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        if (!progPontosRepository.existsById(id)) {
            throw new ResourceNotFoundException("Programa de pontos não encontrado.");
        }
        progPontosRepository.deleteById(id);
    }
}
