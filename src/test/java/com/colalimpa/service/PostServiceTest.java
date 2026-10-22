package com.colalimpa.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.colalimpa.dto.PostRequest;
import com.colalimpa.dto.PostResponse;
import com.colalimpa.model.Post;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.PostRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private PostService postService;

    private Usuario usuario;
    private Post post;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno", "aluno@email.com", null, null, null);
        usuario.setId(1L);

        post = new Post(usuario, "Dúvida de Álgebra", "Como resolver equações de 2 grau?", "Dúvida", "Matemática");
        post.setId(10L);
    }

    @Test
    void shouldCreatePostSuccessfullyWhenDataIsValid() {
        PostRequest request = new PostRequest(1L, "Dúvida de Álgebra", "Como resolver equações de 2 grau?", "Dúvida", "Matemática");

        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostResponse response = postService.criar(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.titulo()).isEqualTo("Dúvida de Álgebra");
    }

    @Test
    void shouldReturnPublicFeedExcludingHighReportedPosts() {
        when(postRepository.findByQtDenunciasLessThanOrderByDataCriacaoDesc(5)).thenReturn(List.of(post));

        List<PostResponse> feed = postService.listarFeedPublico();

        assertThat(feed).hasSize(1);
        assertThat(feed.get(0).titulo()).isEqualTo("Dúvida de Álgebra");
    }

    @Test
    void shouldIncrementReportsWhenPostIsReported() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        postService.denunciar(10L);

        assertThat(post.getQtDenuncias()).isEqualTo(1);
        verify(postRepository).save(post);
    }
}

