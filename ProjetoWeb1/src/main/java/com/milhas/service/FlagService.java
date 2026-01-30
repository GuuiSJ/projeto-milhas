package com.milhas.service;

import com.milhas.dto.flag.FlagDTO;
import java.util.List;

public interface FlagService {

    List<FlagDTO> listarTodas();

   FlagDTO salvar(FlagDTO dto);

    void deletar(Long id);
}
