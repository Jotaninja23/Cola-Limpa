package com.colalimpa.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.colalimpa.dto.ComentarioRequest;
import com.colalimpa.dto.ComentarioResponse;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.model.Comentario;
import com.colalimpa.model.Post;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.ComentarioRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ComentarioServiceTest {

    @Mock
    private ComentarioRepository comentarioRepository;

    @Mock
    private PostService postService;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private ComentarioService comentarioService;

    private Usuario usuario;
    private Post post;
    private Comentario comentario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno", "aluno@email.com", null, null, null);
        usuario.setId(1L);

        post = new Post(usuario, "Dúvida", "Texto do post", "Dúvida", "Matemática");
        post.setId(10L);

        comentario = new Comentario(post, usuario, "Excelente explicação!");
        comentario.setId(100L);
    }

    @Test
    void shouldCreateCommentSuccessfully() {
        ComentarioRequest request = new ComentarioRequest(10L, 1L, "Excelente explicação!");

        when(postService.buscarEntidadePorId(10L)).thenReturn(post);
        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(comentarioRepository.save(any(Comentario.class))).thenReturn(comentario);

        ComentarioResponse response = comentarioService.criar(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(100L);
        assertThat(response.texto()).isEqualTo("Excelente explicação!");
        assertThat(response.usuarioId()).isEqualTo(1L);
    }

    @Test
    void shouldListCommentsByPostExcludingHighReportedComments() {
        when(postService.buscarEntidadePorId(10L)).thenReturn(post);
        when(comentarioRepository.findByPostIdAndQtDenunciasLessThanOrderByDataCriacaoAsc(10L, 5))
                .thenReturn(List.of(comentario));

        List<ComentarioResponse> comentarios = comentarioService.listarPorPost(10L);

        assertThat(comentarios).hasSize(1);
        assertThat(comentarios.get(0).id()).isEqualTo(100L);
        assertThat(comentarios.get(0).texto()).isEqualTo("Excelente explicação!");
    }

    @Test
    void shouldReturnEntityWhenFoundById() {
        when(comentarioRepository.findById(100L)).thenReturn(Optional.of(comentario));

        Comentario encontrado = comentarioService.buscarEntidadePorId(100L);

        assertThat(encontrado).isNotNull();
        assertThat(encontrado.getId()).isEqualTo(100L);
    }

    @Test
    void shouldThrowExceptionWhenCommentNotFoundById() {
        when(comentarioRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> comentarioService.buscarEntidadePorId(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Comentário não encontrado com id: 999");
    }

    @Test
    void shouldIncrementReportsWhenCommentIsReported() {
        when(comentarioRepository.findById(100L)).thenReturn(Optional.of(comentario));

        comentarioService.denunciar(100L);

        assertThat(comentario.getQtDenuncias()).isEqualTo(1);
        verify(comentarioRepository).save(comentario);
    }

    @Test
    void shouldDeleteCommentSuccessfully() {
        when(comentarioRepository.findById(100L)).thenReturn(Optional.of(comentario));

        comentarioService.remover(100L);

        verify(comentarioRepository).delete(comentario);
    }
}
