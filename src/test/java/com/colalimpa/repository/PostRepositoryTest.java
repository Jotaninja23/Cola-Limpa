package com.colalimpa.repository;

import static org.assertj.core.api.Assertions.assertThat;

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
class PostRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PostRepository postRepository;

    private Usuario autor;

    @BeforeEach
    void setUp() {
        autor = new Usuario("Estudante Autor", "autor@email.com", null, null, 60);
        entityManager.persistAndFlush(autor);
    }

    @Test
    void shouldFilterOutPostsWithReportsEqualOrAboveThreshold() {
        Post postLimpo = new Post(autor, "Dica de Estudo", "Texto do post", "Dica", "História");
        Post postDenunciadoExato = new Post(autor, "Post Suspeito 1", "Texto spam", "Spam", "Geral");
        postDenunciadoExato.setQtDenuncias(5);
        Post postMuitasDenuncias = new Post(autor, "Post Suspeito 2", "Texto ofensivo", "Spam", "Geral");
        postMuitasDenuncias.setQtDenuncias(7);

        entityManager.persist(postLimpo);
        entityManager.persist(postDenunciadoExato);
        entityManager.persist(postMuitasDenuncias);
        entityManager.flush();

        List<Post> feed = postRepository.findByQtDenunciasLessThanOrderByDataCriacaoDesc(5);

        assertThat(feed).hasSize(1);
        assertThat(feed.get(0).getTitulo()).isEqualTo("Dica de Estudo");
    }

    @Test
    void shouldFindPostByIdAndFetchUserEagerlyWithEntityGraph() {
        Post post = new Post(autor, "Álgebra Linear", "Dúvida sobre vetores", "Dúvida", "Matemática");
        entityManager.persistAndFlush(post);
        entityManager.clear();

        Optional<Post> encontrado = postRepository.findById(post.getId());

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getUsuario()).isNotNull();
        assertThat(encontrado.get().getUsuario().getNome()).isEqualTo("Estudante Autor");
    }

    @Test
    void shouldFindPostsByCategoria() {
        Post post1 = new Post(autor, "Resumo 1", "Texto", "Resumo", "Química");
        Post post2 = new Post(autor, "Dúvida 1", "Texto", "Dúvida", "Física");

        entityManager.persist(post1);
        entityManager.persist(post2);
        entityManager.flush();

        List<Post> resumos = postRepository.findByCategoria("Resumo");

        assertThat(resumos).hasSize(1);
        assertThat(resumos.get(0).getTitulo()).isEqualTo("Resumo 1");
    }

    @Test
    void shouldFindPostsByMateria() {
        Post postMatematica = new Post(autor, "Cálculo 1", "Limites", "Dúvida", "Matemática");
        Post postBiologia = new Post(autor, "Genética", "DNA", "Resumo", "Biologia");

        entityManager.persist(postMatematica);
        entityManager.persist(postBiologia);
        entityManager.flush();

        List<Post> posts = postRepository.findByMateria("Matemática");

        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).getTitulo()).isEqualTo("Cálculo 1");
    }

    @Test
    void shouldFindPostsByUsuarioIdOrderByDataCriacaoDesc() {
        Post post1 = new Post(autor, "Primeiro Post", "Texto 1", "Dúvida", "Física");
        Post post2 = new Post(autor, "Segundo Post", "Texto 2", "Dica", "Física");

        entityManager.persist(post1);
        entityManager.persist(post2);
        entityManager.flush();

        List<Post> posts = postRepository.findByUsuarioIdOrderByDataCriacaoDesc(autor.getId());

        assertThat(posts).hasSize(2);
        assertThat(posts).extracting(Post::getTitulo).containsExactly("Segundo Post", "Primeiro Post");
    }

    @Test
    void shouldFindPostsWithReportsEqualOrAboveThresholdForModeration() {
        Post postLimpo = new Post(autor, "Dica Limpa", "Texto do post", "Dica", "História");
        Post postDenunciado = new Post(autor, "Post Suspeito", "Spam", "Spam", "Geral");
        postDenunciado.setQtDenuncias(5);

        entityManager.persist(postLimpo);
        entityManager.persist(postDenunciado);
        entityManager.flush();

        List<Post> moderacao = postRepository.findByQtDenunciasGreaterThanEqualOrderByDataCriacaoDesc(5);

        assertThat(moderacao).hasSize(1);
        assertThat(moderacao.get(0).getTitulo()).isEqualTo("Post Suspeito");
    }
}
