package com.milhas.controller;

import com.milhas.service.ReportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReportControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private ReportService reportService;

    @Test
    @WithMockUser(username = "relatorio@teste.com")
    void deveBaixarCSV() throws Exception {
        byte[] csvFake = "DATA;VALOR\n2025-01-01;100".getBytes();
        when(reportService.gerarCsvMovimentacoes(anyString())).thenReturn(csvFake);

        mockMvc.perform(get("/relatorios/movimentacoes/csv"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/csv; charset=UTF-8"))
                .andExpect(content().bytes(csvFake));
    }

    @Test
    @WithMockUser(username = "relatorio@teste.com")
    void deveBaixarPDF() throws Exception {
        byte[] pdfFake = "%PDF-1.4...".getBytes();
        when(reportService.gerarPdfMovimentacoes(anyString())).thenReturn(pdfFake);

        mockMvc.perform(get("/relatorios/movimentacoes/pdf"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andExpect(content().bytes(pdfFake));
    }
}