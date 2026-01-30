package com.milhas.service;

import com.milhas.dto.auth.RegisterRequest;
import com.milhas.dto.auth.UpdatePasswordRequest;
import com.milhas.dto.usuario.UsuarioResponse;
import com.milhas.dto.usuario.UsuarioUpdateRequest;

public interface UsuarioService {
    void registrarUsuario(RegisterRequest dto);
    UsuarioResponse updateProfile(String userEmail, UsuarioUpdateRequest dto);
    UsuarioResponse getProfile(String userEmail);
    void requestPasswordReset(String email);
    void resetPassword(UpdatePasswordRequest dto);
}
