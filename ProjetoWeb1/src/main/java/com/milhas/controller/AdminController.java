package com.milhas.controller;

import com.milhas.dto.flag.FlagDTO;
import com.milhas.dto.progpontos.ProgPontosDTO;
import com.milhas.service.FlagService;
import com.milhas.service.ProgPontosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final FlagService flagService;
    private final ProgPontosService progPontosService;


    @GetMapping("/bandeiras")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FlagDTO>> listarBandeiras() {
        return ResponseEntity.ok(flagService.listarTodas());
    }

    @PostMapping("/bandeiras")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FlagDTO> criarFlag(@Valid @RequestBody FlagDTO dto) {
        return ResponseEntity.ok(flagService.salvar(dto));
    }

    @PutMapping("/bandeiras/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FlagDTO> atualizarFlag(@PathVariable Long id, @Valid @RequestBody FlagDTO dto) {
       FlagDTO dtoAtualizado = new FlagDTO(id, dto.nome());
        return ResponseEntity.ok(flagService.salvar(dtoAtualizado));
    }

    @DeleteMapping("/bandeiras/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarFlag(@PathVariable Long id) {
        flagService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/programas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProgPontosDTO>> listarProg() {
        return ResponseEntity.ok(progPontosService.listarTodos());
    }

    @PostMapping("/programas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProgPontosDTO> criarProg(@Valid @RequestBody ProgPontosDTO dto) {
        return ResponseEntity.ok(progPontosService.salvar(dto));
    }

    @PutMapping("/programas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProgPontosDTO> atualizarProg(@PathVariable Long id, @Valid @RequestBody ProgPontosDTO dto) {
        ProgPontosDTO dtoAtualizado = new ProgPontosDTO(id, dto.nome());
        return ResponseEntity.ok(progPontosService.salvar(dtoAtualizado));
    }

    @DeleteMapping("/programas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarProg(@PathVariable Long id) {
        progPontosService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
