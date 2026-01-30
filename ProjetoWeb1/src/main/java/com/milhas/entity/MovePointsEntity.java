package com.milhas.entity;

import com.milhas.entity.enums.MoveType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacao_pontos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class MovePointsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MoveType tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantidadePontos;

    @Column(nullable = false)
    private LocalDateTime dataMovimentacao;

    private String descricao;

    @ManyToOne
    @JoinColumn(name = "saldo_pontos_id", nullable = false)
    private SaldoPointsEntity saldoPontos;

    @ManyToOne
    @JoinColumn(name = "compra_id")
    private BuyEntity compra;
}
