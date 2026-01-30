package com.milhas.service.impl;

import com.milhas.dto.dashboard.DashboardResponseDTO;
import com.milhas.dto.dashboard.PointsForCardDTO;
import com.milhas.dto.dashboard.PrazoMedioReceberDTO;
import com.milhas.entity.UsuarioEntity;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.BuyRepository;
import com.milhas.repository.MovePointsRepository;
import com.milhas.repository.UsuarioRepository;
import com.milhas.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UsuarioRepository usuarioRepository;
    private final BuyRepository buyRepository;
    private final MovePointsRepository moveRepository;

    public DashboardResponseDTO getDashboardData(String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findEntityByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        List<PointsForCardDTO> pontosPorCartao =
                buyRepository.findPontosAgrupadosPorCartao(usuario.getId());

        Double diasMedios =
                moveRepository.findPrazoMedioRecebimento(usuario.getId());
        PrazoMedioReceberDTO prazoMedio = new PrazoMedioReceberDTO(diasMedios);

        return new DashboardResponseDTO(pontosPorCartao, prazoMedio);
    }

}
