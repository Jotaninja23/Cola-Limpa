package com.colalimpa.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.colalimpa.model.Comentario;
import com.colalimpa.model.Like;
import com.colalimpa.model.Post;
import com.colalimpa.model.Usuario;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class LikeRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private LikeRepository likeRepository;

    private Usuario usuario;
    private Post post;
    private Comentario comentario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno Like", "like@email.com", null, null, 60);
        entityManager.persistAndFlush(usuario);

        post = new Post(usuario, "Post Teste", "Conteudo", "Dúvida", "Química");
        entityManager.persistAndFlush(post);

        comentario = new Comentario(post, usuario, "Comentario Teste");
        entityManager.persistAndFlush(comentario);
    }

    @Test
    void shouldFindLikeByUsuarioIdAndPostId() {
        Like like = new Like(usuario, post);
        entityManager.persistAndFlush(like);
        entityManager.clear();

        Optional<Like> encontrado = likeRepository.findByUsuarioIdAndPostId(usuario.getId(), post.getId());

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getUsuario()).isNotNull();
        assertThat(encontrado.get().getPost()).isNotNull();
    }

    @Test
    void shouldFindLikeByUsuarioIdAndComentarioId() {
        Like like = new Like(usuario, comentario);
        entityManager.persistAndFlush(like);
        entityManager.clear();

        Optional<Like> encontrado = likeRepository.findByUsuarioIdAndComentarioId(usuario.getId(), comentario.getId());

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getUsuario()).isNotNull();
        assertThat(encontrado.get().getComentario()).isNotNull();
    }

    @Test
    void shouldReturnTrueWhenPostLikeExists() {
        Like like = new Like(usuario, post);
        entityManager.persistAndFlush(like);

        boolean exists = likeRepository.existsByUsuarioIdAndPostId(usuario.getId(), post.getId());

        assertThat(exists).isTrue();
    }

    @Test
    void shouldReturnFalseWhenPostLikeDoesNotExist() {
        boolean exists = likeRepository.existsByUsuarioIdAndPostId(usuario.getId(), 9999L);

        assertThat(exists).isFalse();
    }

    @Test
    void shouldReturnTrueWhenComentarioLikeExists() {
        Like like = new Like(usuario, comentario);
        entityManager.persistAndFlush(like);

        boolean exists = likeRepository.existsByUsuarioIdAndComentarioId(usuario.getId(), comentario.getId());

        assertThat(exists).isTrue();
    }

    @Test
    void shouldCountLikesByPostId() {
        Usuario outroUsuario = new Usuario("Outro Aluno", "outro@email.com", null, null, 60);
        entityManager.persistAndFlush(outroUsuario);

        Like like1 = new Like(usuario, post);
        Like like2 = new Like(outroUsuario, post);
        entityManager.persist(like1);
        entityManager.persist(like2);
        entityManager.flush();

        long count = likeRepository.countByPostId(post.getId());

        assertThat(count).isEqualTo(2L);
    }

    @Test
    void shouldCountLikesByComentarioId() {
        Like like = new Like(usuario, comentario);
        entityManager.persistAndFlush(like);

        long count = likeRepository.countByComentarioId(comentario.getId());

        assertThat(count).isEqualTo(1L);
    }
}
