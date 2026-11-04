package com.colalimpa.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.colalimpa.dto.LikeRequest;
import com.colalimpa.dto.LikeResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.model.Comentario;
import com.colalimpa.model.Like;
import com.colalimpa.model.Post;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.LikeRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LikeServiceTest {

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private PostService postService;

    @Mock
    private ComentarioService comentarioService;

    @InjectMocks
    private LikeService likeService;

    private Usuario usuario;
    private Post post;
    private Comentario comentario;
    private Like postLike;
    private Like comentarioLike;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno", "aluno@email.com", null, null, null);
        usuario.setId(1L);

        post = new Post(usuario, "Título", "Conteúdo", "Dúvida", "Física");
        post.setId(10L);

        comentario = new Comentario(post, usuario, "Texto de comentário");
        comentario.setId(20L);

        postLike = new Like(usuario, post);
        postLike.setId(100L);

        comentarioLike = new Like(usuario, comentario);
        comentarioLike.setId(200L);
    }

    @Test
    void shouldRegisterLikeToPostSuccessfully() {
        LikeRequest request = new LikeRequest(1L, 10L, null);

        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(likeRepository.existsByUsuarioIdAndPostId(1L, 10L)).thenReturn(false);
        when(postService.buscarEntidadePorId(10L)).thenReturn(post);
        when(likeRepository.save(any(Like.class))).thenReturn(postLike);

        LikeResponse response = likeService.curtir(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(100L);
        assertThat(post.getQtCurtidas()).isEqualTo(1);
    }

    @Test
    void shouldThrowExceptionWhenUserLikesSamePostTwice() {
        LikeRequest request = new LikeRequest(1L, 10L, null);

        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(likeRepository.existsByUsuarioIdAndPostId(1L, 10L)).thenReturn(true);

        assertThatThrownBy(() -> likeService.curtir(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O usuário já curtiu esta publicação.");
    }

    @Test
    void shouldRegisterLikeToCommentSuccessfully() {
        LikeRequest request = new LikeRequest(1L, null, 20L);

        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(likeRepository.existsByUsuarioIdAndComentarioId(1L, 20L)).thenReturn(false);
        when(comentarioService.buscarEntidadePorId(20L)).thenReturn(comentario);
        when(likeRepository.save(any(Like.class))).thenReturn(comentarioLike);

        LikeResponse response = likeService.curtir(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(200L);
        assertThat(comentario.getQtCurtidas()).isEqualTo(1);
    }

    @Test
    void shouldThrowExceptionWhenUserLikesSameCommentTwice() {
        LikeRequest request = new LikeRequest(1L, null, 20L);

        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(likeRepository.existsByUsuarioIdAndComentarioId(1L, 20L)).thenReturn(true);

        assertThatThrownBy(() -> likeService.curtir(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O usuário já curtiu este comentário.");
    }

    @Test
    void shouldThrowExceptionWhenBothPostAndCommentAreNull() {
        LikeRequest request = new LikeRequest(1L, null, null);

        assertThatThrownBy(() -> likeService.curtir(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O like deve ser associado exatamente a um post ou a um comentário.");
    }

    @Test
    void shouldThrowExceptionWhenBothPostAndCommentAreProvided() {
        LikeRequest request = new LikeRequest(1L, 10L, 20L);

        assertThatThrownBy(() -> likeService.curtir(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O like deve ser associado exatamente a um post ou a um comentário.");
    }

    @Test
    void shouldUnlikePostSuccessfully() {
        post.setQtCurtidas(1);
        when(likeRepository.findByUsuarioIdAndPostId(1L, 10L)).thenReturn(Optional.of(postLike));

        likeService.descurtirPost(1L, 10L);

        assertThat(post.getQtCurtidas()).isEqualTo(0);
        verify(likeRepository).delete(postLike);
    }

    @Test
    void shouldThrowExceptionWhenUnlikingNonExistingPostLike() {
        when(likeRepository.findByUsuarioIdAndPostId(1L, 10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> likeService.descurtirPost(1L, 10L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Like não encontrado para esta publicação.");
    }

    @Test
    void shouldUnlikeCommentSuccessfully() {
        comentario.setQtCurtidas(1);
        when(likeRepository.findByUsuarioIdAndComentarioId(1L, 20L)).thenReturn(Optional.of(comentarioLike));

        likeService.descurtirComentario(1L, 20L);

        assertThat(comentario.getQtCurtidas()).isEqualTo(0);
        verify(likeRepository).delete(comentarioLike);
    }

    @Test
    void shouldThrowExceptionWhenUnlikingNonExistingCommentLike() {
        when(likeRepository.findByUsuarioIdAndComentarioId(1L, 20L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> likeService.descurtirComentario(1L, 20L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Like não encontrado para este comentário.");
    }
}
