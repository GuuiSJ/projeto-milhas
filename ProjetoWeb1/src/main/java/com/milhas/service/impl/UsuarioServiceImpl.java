package com.milhas.service.impl;

import com.milhas.dto.auth.RegisterRequest;
import com.milhas.dto.auth.UpdatePasswordRequest;
import com.milhas.dto.usuario.UsuarioResponse;
import com.milhas.dto.usuario.UsuarioUpdateRequest;
import com.milhas.entity.UsuarioEntity;
import com.milhas.entity.enums.UserRole;
import com.milhas.exception.EmailAlreadyExistsException;
import com.milhas.exception.InvalidPasswordException;
import com.milhas.exception.InvalidTokenException;
import com.milhas.exception.ResourceNotFoundException;
import com.milhas.repository.UsuarioRepository;
import com.milhas.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger log = LoggerFactory.getLogger(UsuarioServiceImpl.class);

    @Override
    @Transactional
    public void registrarUsuario(RegisterRequest dto) {
        if (usuarioRepository.findEntityByEmail(dto.email()).isPresent()) {
            throw new EmailAlreadyExistsException("O e-mail fornecido já está em uso.");
        }
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        if (dto.role() != null) {
            usuario.setRole(dto.role());
        } else {
            usuario.setRole(UserRole.USER);
        }
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public UsuarioResponse updateProfile(String userEmail, UsuarioUpdateRequest dto) {
        UsuarioEntity usuario = findUsuarioByEmail(userEmail);
        usuario.setNome(dto.nome());
        UsuarioEntity updatedUsuario = usuarioRepository.save(usuario);
        return new UsuarioResponse(updatedUsuario.getId(), updatedUsuario.getNome(), updatedUsuario.getEmail());
    }

    @Override
    public UsuarioResponse getProfile(String userEmail) {
        UsuarioEntity usuario = findUsuarioByEmail(userEmail);
        return new UsuarioResponse(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        UsuarioEntity usuario = findUsuarioByEmail(email);
        String token = UUID.randomUUID().toString();
        usuario.setResetPasswordToken(token);
        usuario.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
        usuarioRepository.save(usuario);
        log.info("Token de reset gerado para {}: {}", email, token);
    }

    @Override
    @Transactional
    public void resetPassword(UpdatePasswordRequest dto) {
        if (!dto.novaSenha().equals(dto.confirmacaoSenha())) {
            throw new InvalidPasswordException("As senhas não conferem.");
        }
        UsuarioEntity usuario = usuarioRepository.findByResetPasswordToken(dto.token()).orElseThrow(() -> new InvalidTokenException("Token inválido ou não encontrado."));

        if (usuario.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Token expirado.");
        }
        usuario.setSenha(passwordEncoder.encode(dto.novaSenha()));
        usuario.setResetPasswordToken(null);
        usuario.setResetPasswordTokenExpiry(null);
        usuarioRepository.save(usuario);
    }

    private UsuarioEntity findUsuarioByEmail(String email) {
        return usuarioRepository.findEntityByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }
}
