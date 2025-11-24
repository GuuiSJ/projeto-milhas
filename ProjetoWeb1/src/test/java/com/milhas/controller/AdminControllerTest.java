package com.milhas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.milhas.dto.flag.FlagDTO;
import com.milhas.dto.progpontos.ProgPontosDTO;
import com.milhas.service.FlagService;
import com.milhas.service.ProgPontosService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private FlagService flagService;
    @MockBean private ProgPontosService progPontosService;

    @Test
    @DisplayName("Deve criar bandeira com sucesso (ADMIN)")
    @WithMockUser(username = "admin", roles = {"ADMIN"}) // Simula Admin logado
    void deveCriarBandeira() throws Exception {
        FlagDTO envio = new FlagDTO(null, "Visa");
        FlagDTO retorno = new FlagDTO(1L, "Visa");

        when(flagService.salvar(any())).thenReturn(retorno);

        mockMvc.perform(post("/admin/bandeiras")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(envio)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("Visa"));
    }

    @Test
    @DisplayName("Deve listar programas de pontos (ADMIN)")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deveListarProgramas() throws Exception {
        when(progPontosService.listarTodos())
                .thenReturn(List.of(new ProgPontosDTO(1L, "Livelo")));

        mockMvc.perform(get("/admin/programas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Livelo"));
    }

    @Test
    @DisplayName("Deve proibir acesso de usuário comum a rota de admin")
    @WithMockUser(username = "user", roles = {"USER"}) // Simula User Comum
    void deveProibirUserComum() throws Exception {
        mockMvc.perform(get("/admin/bandeiras"))
                .andExpect(status().isForbidden()); // Espera 403
    }
}