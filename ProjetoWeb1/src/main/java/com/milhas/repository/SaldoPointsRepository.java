package com.milhas.repository;

import com.milhas.entity.SaldoPointsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SaldoPointsRepository extends JpaRepository<SaldoPointsEntity, Long> {

    List<SaldoPointsEntity> findByUsuarioId(Long usuarioId);

    Optional<SaldoPointsEntity> findByUsuarioIdAndProgPontosId(Long usuarioId, Long programaPontosId);
}