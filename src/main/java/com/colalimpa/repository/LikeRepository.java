package com.colalimpa.repository;

import com.colalimpa.model.Like;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    @EntityGraph(attributePaths = {"usuario", "post"})
    Optional<Like> findByUsuarioIdAndPostId(Long usuarioId, Long postId);

    @EntityGraph(attributePaths = {"usuario", "comentario"})
    Optional<Like> findByUsuarioIdAndComentarioId(Long usuarioId, Long comentarioId);

    boolean existsByUsuarioIdAndPostId(Long usuarioId, Long postId);

    boolean existsByUsuarioIdAndComentarioId(Long usuarioId, Long comentarioId);

    long countByPostId(Long postId);

    long countByComentarioId(Long comentarioId);
}

