package com.milhas.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

    void armazenarComprovante(MultipartFile arquivo, Long compraId, String emailUsuario);
}
