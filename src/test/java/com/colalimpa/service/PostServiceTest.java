package com.colalimpa.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.colalimpa.dto.PostRequest;
import com.colalimpa.dto.PostResponse;
import com.colalimpa.dto.PostUpdateRequest;
import com.colalimpa.exception.ResourceNotFoundException;
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
import org.springframework.security.access.AccessDeniedException;

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
    void shouldReturnPostResponseWhenFoundById() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        PostResponse response = postService.buscarPorId(10L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.titulo()).isEqualTo("Dúvida de Álgebra");
    }

    @Test
    void shouldThrowExceptionWhenPostNotFoundById() {
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.buscarPorId(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Post não encontrado com id: 999");
    }

    @Test
    void shouldReturnPublicFeedExcludingHighReportedPosts() {
        when(postRepository.findByQtDenunciasLessThanOrderByDataCriacaoDesc(5)).thenReturn(List.of(post));

        List<PostResponse> feed = postService.listarFeedPublico();

        assertThat(feed).hasSize(1);
        assertThat(feed.get(0).titulo()).isEqualTo("Dúvida de Álgebra");
    }

    @Test
    void shouldListPostsByMateria() {
        when(postRepository.findByMateria("Matemática")).thenReturn(List.of(post));

        List<PostResponse> posts = postService.listarPorMateria("Matemática");

        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).materia()).isEqualTo("Matemática");
    }

    @Test
    void shouldListPostsByCategoria() {
        when(postRepository.findByCategoria("Dúvida")).thenReturn(List.of(post));

        List<PostResponse> posts = postService.listarPorCategoria("Dúvida");

        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).categoria()).isEqualTo("Dúvida");
    }

    @Test
    void shouldListPostsByUsuario() {
        when(postRepository.findByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(List.of(post));

        List<PostResponse> posts = postService.listarPorUsuario(1L);

        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).usuarioId()).isEqualTo(1L);
    }

    @Test
    void shouldIncrementReportsWhenPostIsReported() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        postService.denunciar(10L);

        assertThat(post.getQtDenuncias()).isEqualTo(1);
        verify(postRepository).save(post);
    }

    @Test
    void shouldDeletePostSuccessfully() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        postService.remover(10L);

        verify(postRepository).delete(post);
    }

    @Test
    void shouldUpdatePostSuccessfullyWhenUserIsAuthor() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostUpdateRequest update = new PostUpdateRequest("Novo Título", "Novo Texto", "Resumo", "Física");
        PostResponse response = postService.editar(10L, 1L, false, update);

        assertThat(response).isNotNull();
        assertThat(post.getTitulo()).isEqualTo("Novo Título");
        assertThat(post.getTexto()).isEqualTo("Novo Texto");
        assertThat(post.getCategoria()).isEqualTo("Resumo");
        assertThat(post.getMateria()).isEqualTo("Física");
    }

    @Test
    void shouldUpdatePostSuccessfullyWhenUserIsAdminEvenIfNotAuthor() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostUpdateRequest update = new PostUpdateRequest("Modificado por Admin", "Texto", "Resumo", "Química");
        PostResponse response = postService.editar(10L, 999L, true, update);

        assertThat(response).isNotNull();
        assertThat(post.getTitulo()).isEqualTo("Modificado por Admin");
    }

    @Test
    void shouldThrowAccessDeniedWhenUpdatingPostByNonAuthorNonAdmin() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));
        PostUpdateRequest update = new PostUpdateRequest("Hack", "Texto", "Resumo", "História");

        assertThatThrownBy(() -> postService.editar(10L, 2L, false, update))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("Você não possui permissão para editar esta publicação.");
    }

    @Test
    void shouldDeletePostSuccessfullyWhenUserIsAuthor() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        postService.remover(10L, 1L, false);

        verify(postRepository).delete(post);
    }

    @Test
    void shouldDeletePostSuccessfullyWhenUserIsAdmin() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        postService.remover(10L, 999L, true);

        verify(postRepository).delete(post);
    }

    @Test
    void shouldThrowAccessDeniedWhenDeletingPostByNonAuthorNonAdmin() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));

        assertThatThrownBy(() -> postService.remover(10L, 2L, false))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("Você não possui permissão para remover esta publicação.");
    }

    @Test
    void shouldListReportedPostsForModeration() {
        when(postRepository.findByQtDenunciasGreaterThanEqualOrderByDataCriacaoDesc(5))
                .thenReturn(List.of(post));

        List<PostResponse> ocultados = postService.listarOcultadosPorDenuncia();

        assertThat(ocultados).hasSize(1);
    }

    @Test
    void shouldApprovePostAndResetReports() {
        post.setQtDenuncias(5);
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostResponse response = postService.aprovarPublicacao(10L);

        assertThat(response).isNotNull();
        assertThat(post.getQtDenuncias()).isEqualTo(0);
        verify(postRepository).save(post);
    }
}
