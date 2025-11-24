package com.milhas.service;

import com.milhas.dto.buy.BuyRequest;
import com.milhas.dto.buy.BuyResponse;
import com.milhas.entity.CardEntity;
import com.milhas.entity.UsuarioEntity;
import com.milhas.entity.enums.BuyStatus;
import com.milhas.repository.BuyRepository;
import com.milhas.repository.CardRepository;
import com.milhas.repository.UsuarioRepository;
import com.milhas.service.impl.BuyServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BuyServiceTest {

    @Mock
    private BuyRepository buyRepository;

    @Mock
    private CardRepository cardRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private BuyServiceImpl buyService;

    @Test
    @DisplayName("Deve calcular pontos corretamente: R$ 100,00 * Fator 2.5 = 250 Pontos")
    void deveCalcularPontosComSucesso() {
        // CENÁRIO
        String email = "teste@milhas.com";
        Long cartaoId = 1L;
        BigDecimal valorGasto = new BigDecimal("100.00");
        BigDecimal fatorCartao = new BigDecimal("2.5");

        BuyRequest request = new BuyRequest("Notebook", valorGasto, LocalDate.now(), cartaoId);

        // Entidades que o banco retornaria
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setId(1L);
        usuario.setEmail(email);

        CardEntity cartao = new CardEntity();
        cartao.setId(cartaoId);
        cartao.setFatorConversao(fatorCartao);
        cartao.setUsuario(usuario);

        when(usuarioRepository.findEntityByEmail(email)).thenReturn(Optional.of(usuario));
        when(cardRepository.findById(cartaoId)).thenReturn(Optional.of(cartao));
        // Quando salvar, retorna o próprio objeto salvo
        when(buyRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // AÇÃO Executa o método real
        BuyResponse response = buyService.registrarCompra(request, email);

        // VALIDAÇÃO Confere se a matemática bateu
        assertNotNull(response);

        // Valida se 100 * 2.5 deu 250.00
        assertEquals(0, new BigDecimal("250.000").compareTo(response.pontosCalculados()));

        // Valida se status inicial é PENDENTE
        assertEquals(BuyStatus.PENDENTE, response.status());

        // Garante que o banco foi chamado 1 vez
        verify(buyRepository, times(1)).save(any());
    }
}