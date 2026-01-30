package com.milhas.service.impl;

import com.milhas.entity.BuyEntity;
import com.milhas.entity.ComprovanteBuyEntity;
import com.milhas.entity.UsuarioEntity;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.BuyRepository;
import com.milhas.repository.ComprovanteBuyRepository;
import com.milhas.repository.UsuarioRepository;
import com.milhas.service.FileUploadService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private final BuyRepository buyRepository;
    private final ComprovanteBuyRepository comprovanteRepository;
    private final UsuarioRepository usuarioRepository;
    private final Path storageLocation;

    public FileUploadServiceImpl(
            BuyRepository compraRepository,
            ComprovanteBuyRepository comprovanteRepository,
            UsuarioRepository usuarioRepository,
            @Value("${file.upload-dir}") String uploadDir) {

        this.buyRepository = compraRepository;
        this.comprovanteRepository = comprovanteRepository;
        this.usuarioRepository = usuarioRepository;
        this.storageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.storageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Não foi possível criar o diretório para upload em: " + this.storageLocation, ex);
        }
    }

    @Override
    @Transactional
    public void armazenarComprovante(MultipartFile arquivo, Long compraId, String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findEntityByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        BuyEntity compra = buyRepository.findById(compraId)
                .orElseThrow(() -> new ResourceNotFoundException("Compra não encontrada."));

        if (!compra.getCartao().getUsuario().getId().equals(usuario.getId())) {
            throw new ResourceNotFoundException("Compra não pertence ao usuário.");
        }

        String nomeOriginal = StringUtils.cleanPath(arquivo.getOriginalFilename());
        if (nomeOriginal.contains("..")) {
            throw new RuntimeException("Nome de arquivo inválido: " + nomeOriginal);
        }

        String extensao = "";
        int i = nomeOriginal.lastIndexOf('.');
        if (i > 0) {
            extensao = nomeOriginal.substring(i);
        }
        String nomeUnico = UUID.randomUUID().toString() + extensao;

        try {
            Path targetLocation = this.storageLocation.resolve(nomeUnico);
            Files.copy(arquivo.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            ComprovanteBuyEntity comprovante = new ComprovanteBuyEntity();
            comprovante.setCompra(compra);
            comprovante.setNomeArquivo(nomeOriginal);
            comprovante.setTipoArquivo(arquivo.getContentType());
            comprovante.setUrlArquivo(targetLocation.toString());

            comprovanteRepository.save(comprovante);

        } catch (IOException ex) {
            throw new RuntimeException("Erro ao salvar o arquivo " + nomeOriginal, ex);
        }
    }
}
