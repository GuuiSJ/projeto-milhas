package com.milhas.repository;

import com.milhas.entity.CardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<CardEntity, Long> {

    List<CardEntity> findByUsuarioId(Long usuarioId);
}
