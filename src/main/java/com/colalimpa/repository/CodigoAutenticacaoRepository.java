package com.colalimpa.repository;

import com.colalimpa.model.CodigoAutenticacao;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodigoAutenticacaoRepository extends JpaRepository<CodigoAutenticacao, Long> {

    @EntityGraph(attributePaths = {"usuario"})
    Optional<CodigoAutenticacao> findTopByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    long countByUsuarioIdAndDataCriacaoAfter(Long usuarioId, LocalDateTime data);
}

