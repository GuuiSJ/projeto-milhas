package com.milhas.entity;

import com.milhas.entity.enums.BuyStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "compra")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class BuyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorGasto;

    @Column(precision = 10, scale = 2)
    private BigDecimal pontosCalculados;

    @Column(nullable = false)
    private LocalDate dataCompra;

    private LocalDate dataCreditoPrevista;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BuyStatus status;

    @ManyToOne
    @JoinColumn(name = "cartao_id", nullable = false)
    private CardEntity cartao;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ComprovanteBuyEntity> comprovantes;
}
