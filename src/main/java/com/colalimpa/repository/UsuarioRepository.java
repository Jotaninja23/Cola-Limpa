package com.colalimpa.repository;

import com.colalimpa.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByTelefone(String telefone);

    boolean existsByEmail(String email);

    boolean existsByTelefone(String telefone);
}

