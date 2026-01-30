package com.milhas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.milhas.dto.buy.BuyRequest;
import com.milhas.dto.buy.BuyResponse;
import com.milhas.entity.enums.BuyStatus;
import com.milhas.service.BuyService;
import com.milhas.service.FileUploadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BuyControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private BuyService buyService;
    @MockBean private FileUploadService fileUploadService;

    @Test
    @WithMockUser(username = "comprador@teste.com")
    void deveRegistrarCompra() throws Exception {
        BuyRequest request = new BuyRequest("PC Gamer", new BigDecimal("5000.00"), LocalDate.now(), 1L);

        BuyResponse response = new BuyResponse(
                1L, "PC Gamer", new BigDecimal("5000.00"), new BigDecimal("10000.0"),
                LocalDate.now(), LocalDate.now().plusDays(30), BuyStatus.PENDENTE,
                1L, "Visa Infinite", 30
        );

        when(buyService.registrarCompra(any(), eq("comprador@teste.com"))).thenReturn(response);

        mockMvc.perform(post("/compras")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.pontosCalculados").value(10000.0));
    }
}