package com.milhas.repository;

import com.milhas.dto.dashboard.PointsForCardDTO;
import com.milhas.entity.BuyEntity;
import com.milhas.entity.enums.BuyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BuyRepository extends JpaRepository<BuyEntity, Long> {

    List<BuyEntity> findByCartaoUsuarioId(Long usuarioId);

    List<BuyEntity> findByStatusAndDataCreditoPrevistaBefore(BuyStatus status, LocalDate hoje);

    @Query("SELECT new com.milhas.dto.dashboard.PointsForCardDTO(c.cartao.id, c.cartao.nomePersonalizado, SUM(c.pontosCalculados)) " +
            "FROM BuyEntity c " +
            "WHERE c.cartao.usuario.id = :usuarioId " +
            "AND c.status = com.milhas.entity.enums.BuyStatus.CREDITADO " +
            "GROUP BY c.cartao.id, c.cartao.nomePersonalizado")
    List<PointsForCardDTO> findPontosAgrupadosPorCartao(@Param("usuarioId") Long usuarioId);

}
