package com.milhas.service;

import com.milhas.dto.progpontos.ProgPontosDTO;
import java.util.List;

public interface ProgPontosService {

    List<ProgPontosDTO> listarTodos();


    ProgPontosDTO salvar(ProgPontosDTO dto);

    void deletar(Long id);
}
