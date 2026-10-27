package com.colalimpa.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.colalimpa.model.CodigoAutenticacao;
import com.colalimpa.model.Usuario;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CodigoAutenticacaoRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CodigoAutenticacaoRepository codigoRepository;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno Auth", "auth@email.com", null, null, 60);
        entityManager.persistAndFlush(usuario);
    }

    @Test
    void shouldFindTopByUsuarioIdOrderByDataCriacaoDesc() {
        CodigoAutenticacao c1 = new CodigoAutenticacao(usuario, "111111", "EMAIL", LocalDateTime.now().plusMinutes(5));
        CodigoAutenticacao c2 = new CodigoAutenticacao(usuario, "222222", "EMAIL", LocalDateTime.now().plusMinutes(5));

        entityManager.persist(c1);
        entityManager.persist(c2);
        entityManager.flush();
        entityManager.clear();

        Optional<CodigoAutenticacao> top = codigoRepository.findTopByUsuarioIdOrderByDataCriacaoDesc(usuario.getId());

        assertThat(top).isPresent();
        assertThat(top.get().getCodigo()).isEqualTo("222222");
        assertThat(top.get().getUsuario()).isNotNull();
    }

    @Test
    void shouldCountCodesCreatedAfterDate() {
        CodigoAutenticacao c1 = new CodigoAutenticacao(usuario, "111111", "EMAIL", LocalDateTime.now().plusMinutes(5));
        entityManager.persistAndFlush(c1);

        LocalDateTime umMinutoAtras = LocalDateTime.now().minusMinutes(1);
        long count = codigoRepository.countByUsuarioIdAndDataCriacaoAfter(usuario.getId(), umMinutoAtras);

        assertThat(count).isEqualTo(1L);
    }
}
