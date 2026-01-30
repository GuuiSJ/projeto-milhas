package com.milhas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "cartao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class CardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomePersonalizado;

    @Column(length = 4)
    private String ultimosDigitos;

    @Column(precision = 10, scale = 2)
    private BigDecimal fatorConversao;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

    @ManyToOne
    @JoinColumn(name = "bandeira_id", nullable = false)
    private FlagEntity bandeira;

    @ManyToOne
    @JoinColumn(name = "programa_pontos_id", nullable = false)
    private ProgPontosEntity progPontos;

    @OneToMany(mappedBy = "cartao")
    private Set<BuyEntity> compras;
}
