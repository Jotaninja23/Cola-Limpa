package com.colalimpa.repository;

import com.colalimpa.model.CronometroHistorico;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CronometroHistoricoRepository extends JpaRepository<CronometroHistorico, Long> {

    @EntityGraph(attributePaths = {"usuario"})
    List<CronometroHistorico> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    @EntityGraph(attributePaths = {"usuario"})
    List<CronometroHistorico> findByUsuarioIdAndDataCriacaoBetweenOrderByDataCriacaoAsc(
            Long usuarioId,
            LocalDateTime inicio,
            LocalDateTime fim
    );
}

