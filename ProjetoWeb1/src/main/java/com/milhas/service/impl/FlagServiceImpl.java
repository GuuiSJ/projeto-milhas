package com.milhas.service.impl;

import com.milhas.dto.flag.FlagDTO;
import com.milhas.entity.FlagEntity;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.FlagRepository;
import com.milhas.service.FlagService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlagServiceImpl implements FlagService {

    private final FlagRepository flagRepository;

    @Override
    public List<FlagDTO> listarTodas() {
        return flagRepository.findAll().stream()
                .map(b -> new FlagDTO(b.getId(), b.getNome()))
                .toList();
    }

    @Override
    @Transactional
    public FlagDTO salvar(FlagDTO dto) {
        FlagEntity flagEntity = new FlagEntity();
        if (dto.id() != null) {
            flagEntity = flagRepository.findById(dto.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Bandeira não encontrada."));
        }
        flagEntity.setNome(dto.nome());
        FlagEntity salva = flagRepository.save(flagEntity);
        return new FlagDTO(salva.getId(), salva.getNome());
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        if (!flagRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bandeira não encontrada.");
        }
        flagRepository.deleteById(id);
    }
}
