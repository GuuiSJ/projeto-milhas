package com.milhas.service;

public interface ReportService {

    byte[] gerarCsvMovimentacoes(String emailUsuario);

    byte[] gerarPdfMovimentacoes(String emailUsuario);
}
