package com.colalimpa.controller;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.colalimpa.dto.ComentarioResponse;
import com.colalimpa.dto.PostResponse;
import com.colalimpa.service.ComentarioService;
import com.colalimpa.service.PostService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = ModeracaoController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class ModeracaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @MockBean
    private ComentarioService comentarioService;

    @Test
    void shouldReturnReportedPosts() throws Exception {
        PostResponse response = new PostResponse(
                10L, 1L, "Spammer", null, "Spam", "Texto", "Dúvida", "Matemática", 0, 5, LocalDateTime.now()
        );

        when(postService.listarOcultadosPorDenuncia()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/moderacao/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10L))
                .andExpect(jsonPath("$[0].qtDenuncias").value(5));
    }

    @Test
    void shouldApprovePost() throws Exception {
        PostResponse response = new PostResponse(
                10L, 1L, "Aluno", null, "Título", "Texto", "Dúvida", "Matemática", 0, 0, LocalDateTime.now()
        );

        when(postService.aprovarPublicacao(10L)).thenReturn(response);

        mockMvc.perform(post("/api/moderacao/posts/10/aprovar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.qtDenuncias").value(0));
    }

    @Test
    void shouldDeletePostPermanently() throws Exception {
        doNothing().when(postService).remover(10L);

        mockMvc.perform(delete("/api/moderacao/posts/10"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnReportedComments() throws Exception {
        ComentarioResponse response = new ComentarioResponse(
                20L, 10L, 1L, "Spammer", null, "Ofensivo", 0, 5, LocalDateTime.now()
        );

        when(comentarioService.listarOcultadosPorDenuncia()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/moderacao/comentarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(20L))
                .andExpect(jsonPath("$[0].qtDenuncias").value(5));
    }

    @Test
    void shouldApproveComment() throws Exception {
        ComentarioResponse response = new ComentarioResponse(
                20L, 10L, 1L, "Aluno", null, "Comentário recuperado", 0, 0, LocalDateTime.now()
        );

        when(comentarioService.aprovarComentario(20L)).thenReturn(response);

        mockMvc.perform(post("/api/moderacao/comentarios/20/aprovar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(20L))
                .andExpect(jsonPath("$.qtDenuncias").value(0));
    }

    @Test
    void shouldDeleteCommentPermanently() throws Exception {
        doNothing().when(comentarioService).remover(20L);

        mockMvc.perform(delete("/api/moderacao/comentarios/20"))
                .andExpect(status().isNoContent());
    }
}

