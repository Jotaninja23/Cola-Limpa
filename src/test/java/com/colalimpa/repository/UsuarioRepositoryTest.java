package com.colalimpa.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.colalimpa.model.Usuario;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UsuarioRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void shouldPersistAndFindUserByEmail() {
        Usuario usuario = new Usuario("Maria Silva", "maria@email.com", "11988887777", null, 60);
        entityManager.persistAndFlush(usuario);

        Optional<Usuario> encontrado = usuarioRepository.findByEmail("maria@email.com");

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getNome()).isEqualTo("Maria Silva");
        assertThat(encontrado.get().getTelefone()).isEqualTo("11988887777");
    }

    @Test
    void shouldPersistAndFindUserByTelefone() {
        Usuario usuario = new Usuario("João Santos", "joao@email.com", "11977776666", null, 45);
        entityManager.persistAndFlush(usuario);

        Optional<Usuario> encontrado = usuarioRepository.findByTelefone("11977776666");

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getNome()).isEqualTo("João Santos");
        assertThat(encontrado.get().getEmail()).isEqualTo("joao@email.com");
    }

    @Test
    void shouldReturnTrueWhenEmailExists() {
        Usuario usuario = new Usuario("Ana", "ana@email.com", null, null, 30);
        entityManager.persistAndFlush(usuario);

        boolean exists = usuarioRepository.existsByEmail("ana@email.com");

        assertThat(exists).isTrue();
    }

    @Test
    void shouldReturnFalseWhenEmailDoesNotExist() {
        boolean exists = usuarioRepository.existsByEmail("inexistente@email.com");

        assertThat(exists).isFalse();
    }

    @Test
    void shouldReturnTrueWhenTelefoneExists() {
        Usuario usuario = new Usuario("Carlos", null, "11911112222", null, 30);
        entityManager.persistAndFlush(usuario);

        boolean exists = usuarioRepository.existsByTelefone("11911112222");

        assertThat(exists).isTrue();
    }

    @Test
    void shouldThrowExceptionWhenDuplicateEmailIsPersisted() {
        Usuario usuario1 = new Usuario("User 1", "duplicado@email.com", null, null, 30);
        entityManager.persistAndFlush(usuario1);

        Usuario usuario2 = new Usuario("User 2", "duplicado@email.com", null, null, 30);

        assertThatThrownBy(() -> entityManager.persistAndFlush(usuario2))
                .hasRootCauseInstanceOf(org.h2.jdbc.JdbcSQLIntegrityConstraintViolationException.class);
    }
}
