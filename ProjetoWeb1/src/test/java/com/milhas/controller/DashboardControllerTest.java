package com.milhas.controller;

import com.milhas.dto.dashboard.DashboardResponseDTO;
import com.milhas.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DashboardControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DashboardService dashboardService;

    @Test
    @WithMockUser(username = "dash@teste.com")
    void deveRetornarDadosDoDashboard() throws Exception {

        DashboardResponseDTO fakeData = new DashboardResponseDTO(
                List.of(),
                null
        );

        when(dashboardService.getDashboardData("dash@teste.com")).thenReturn(fakeData);

        mockMvc.perform(get("/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pontosPorCartao").isArray());
    }
}