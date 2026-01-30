package com.milhas.controller;

import com.milhas.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class NotificationControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private NotificationService notificationService;

    @Test
    @WithMockUser(username = "user@notify.com")
    void deveListarNotificacoes() throws Exception {
        when(notificationService.listarMinhasNotificacoes(anyString())).thenReturn(List.of());

        mockMvc.perform(get("/notificacoes"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user@notify.com")
    void deveMarcarComoLida() throws Exception {
        mockMvc.perform(patch("/notificacoes/1/lida"))
                .andExpect(status().isNoContent()); // 204

        verify(notificationService).marcarComoLida(1L, "user@notify.com");
    }
}