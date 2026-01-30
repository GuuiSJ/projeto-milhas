package com.milhas.repository;

import com.milhas.entity.MovePointsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovePointsRepository extends JpaRepository<MovePointsEntity, Long> {

    List<MovePointsEntity> findBySaldoPontosUsuarioId(Long usuarioId);

    @Query(value = """
    SELECT AVG(CAST(m.data_movimentacao AS DATE) - c.data_compra)
    FROM movimentacao_pontos m
    JOIN compra c ON m.compra_id = c.id
    JOIN saldo_pontos s ON m.saldo_pontos_id = s.id
    WHERE s.usuario_id = :usuarioId
      AND m.tipo = 'ACUMULO'
      AND m.compra_id IS NOT NULL
    """, nativeQuery = true)
    Double findPrazoMedioRecebimento(@Param("usuarioId") Long usuarioId);
}
