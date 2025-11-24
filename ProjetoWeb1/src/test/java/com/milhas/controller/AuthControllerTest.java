package com.milhas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.milhas.dto.auth.LoginRequestDTO;
import com.milhas.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("Deve retornar 200 OK e Token JWT ao fazer login com sucesso")
    void deveLogarComSucesso() throws Exception {

        LoginRequestDTO login = new LoginRequestDTO("admin@teste.com", "123456");
        String tokenFalso = "eyJ_TOKEN_FALSO_PARA_TESTE";

        Authentication authMock = mock(Authentication.class);
        when(authMock.getName()).thenReturn("admin@teste.com");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authMock);


        when(jwtTokenProvider.gerarToken("admin@teste.com")).thenReturn(tokenFalso);


        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login))) // Envia o JSON
                .andExpect(status().isOk()) // Espera 200 OK
                .andExpect(jsonPath("$.token").value(tokenFalso)); // Espera receber o token
    }

    @Test
    @DisplayName("Deve retornar 400 Bad Request se login vier sem senha")
    void deveFalharSemSenha() throws Exception {

        String jsonInvalido = "{\"email\": \"teste@email.com\"}";

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonInvalido))
                .andExpect(status().isBadRequest()); // Espera erro 400
    }
}