package com.colalimpa.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.colalimpa.model.Comentario;
import com.colalimpa.model.Post;
import com.colalimpa.model.Usuario;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ComentarioRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ComentarioRepository comentarioRepository;

    private Usuario usuario;
    private Post post;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno Comentador", "comentador@email.com", null, null, 60);
        entityManager.persistAndFlush(usuario);

        post = new Post(usuario, "Post com Comentários", "Texto explicativo", "Dúvida", "Física");
        entityManager.persistAndFlush(post);
    }

    @Test
    void shouldFindCommentsByPostIdAndFilterOutHighReportedComments() {
        Comentario comentarioLimpo = new Comentario(post, usuario, "Ótima explicação!");
        Comentario comentarioSpam = new Comentario(post, usuario, "Spam ofensivo");
        comentarioSpam.setQtDenuncias(5);

        entityManager.persist(comentarioLimpo);
        entityManager.persist(comentarioSpam);
        entityManager.flush();

        List<Comentario> comentarios = comentarioRepository
                .findByPostIdAndQtDenunciasLessThanOrderByDataCriacaoAsc(post.getId(), 5);

        assertThat(comentarios).hasSize(1);
        assertThat(comentarios.get(0).getTexto()).isEqualTo("Ótima explicação!");
    }

    @Test
    void shouldFindCommentByIdAndFetchUserAndPostEagerly() {
        Comentario comentario = new Comentario(post, usuario, "Entendi perfeitamente.");
        entityManager.persistAndFlush(comentario);
        entityManager.clear();

        Optional<Comentario> encontrado = comentarioRepository.findById(comentario.getId());

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getUsuario()).isNotNull();
        assertThat(encontrado.get().getPost()).isNotNull();
    }

    @Test
    void shouldFindCommentsByUsuarioIdOrderByDataCriacaoDesc() {
        Comentario c1 = new Comentario(post, usuario, "Primeiro comentário");
        Comentario c2 = new Comentario(post, usuario, "Segundo comentário");

        entityManager.persist(c1);
        entityManager.persist(c2);
        entityManager.flush();

        List<Comentario> comentarios = comentarioRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuario.getId());

        assertThat(comentarios).hasSize(2);
        assertThat(comentarios).extracting(Comentario::getTexto)
                .containsExactly("Segundo comentário", "Primeiro comentário");
    }
}
