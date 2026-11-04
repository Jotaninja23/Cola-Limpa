package com.colalimpa.repository;

import com.colalimpa.model.Comentario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    @EntityGraph(attributePaths = {"usuario"})
    List<Comentario> findByPostIdOrderByDataCriacaoAsc(Long postId);

    @EntityGraph(attributePaths = {"usuario"})
    List<Comentario> findByPostIdAndQtDenunciasLessThanOrderByDataCriacaoAsc(Long postId, Integer limiteDenuncias);

    @EntityGraph(attributePaths = {"usuario", "post"})
    List<Comentario> findByQtDenunciasGreaterThanEqualOrderByDataCriacaoDesc(Integer limiteDenuncias);

    @Override
    @EntityGraph(attributePaths = {"usuario", "post"})
    Optional<Comentario> findById(Long id);

    @EntityGraph(attributePaths = {"usuario"})
    List<Comentario> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);
}

