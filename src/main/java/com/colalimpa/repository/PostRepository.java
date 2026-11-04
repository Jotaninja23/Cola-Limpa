package com.colalimpa.repository;

import com.colalimpa.model.Post;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Override
    @EntityGraph(attributePaths = {"usuario"})
    List<Post> findAll();

    @Override
    @EntityGraph(attributePaths = {"usuario"})
    Optional<Post> findById(Long id);

    @EntityGraph(attributePaths = {"usuario"})
    List<Post> findByCategoria(String categoria);

    @EntityGraph(attributePaths = {"usuario"})
    List<Post> findByMateria(String materia);

    @EntityGraph(attributePaths = {"usuario"})
    List<Post> findByQtDenunciasLessThanOrderByDataCriacaoDesc(Integer limiteDenuncias);

    @EntityGraph(attributePaths = {"usuario"})
    List<Post> findByQtDenunciasGreaterThanEqualOrderByDataCriacaoDesc(Integer limiteDenuncias);

    @EntityGraph(attributePaths = {"usuario"})
    List<Post> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);
}

