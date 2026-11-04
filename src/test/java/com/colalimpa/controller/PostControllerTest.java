package com.colalimpa.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.colalimpa.dto.PostRequest;
import com.colalimpa.dto.PostResponse;
import com.colalimpa.dto.PostUpdateRequest;
import com.colalimpa.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = PostController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PostService postService;

    @Test
    void shouldReturnCreatedWhenCreatingValidPost() throws Exception {
        PostRequest request = new PostRequest(1L, "Título", "Texto do post", "Dúvida", "Matemática");
        PostResponse response = new PostResponse(
                10L, 1L, "Aluno", null, "Título", "Texto do post", "Dúvida", "Matemática", 0, 0, LocalDateTime.now()
        );

        when(postService.criar(any())).thenReturn(response);

        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/posts/10"))
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.titulo").value("Título"));
    }

    @Test
    void shouldReturnBadRequestWhenCreatingPostWithMissingFields() throws Exception {
        PostRequest request = new PostRequest(null, "", "", "", "");

        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnPostById() throws Exception {
        PostResponse response = new PostResponse(
                10L, 1L, "Aluno", null, "Título", "Texto do post", "Dúvida", "Matemática", 0, 0, LocalDateTime.now()
        );

        when(postService.buscarPorId(10L)).thenReturn(response);

        mockMvc.perform(get("/api/posts/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.titulo").value("Título"));
    }

    @Test
    void shouldReturnPublicFeedWhenNoParamsProvided() throws Exception {
        PostResponse response = new PostResponse(
                10L, 1L, "Aluno", null, "Título", "Texto do post", "Dúvida", "Matemática", 0, 0, LocalDateTime.now()
        );

        when(postService.listarFeedPublico()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10L));
    }

    @Test
    void shouldReturnPostsFilteredByMateria() throws Exception {
        PostResponse response = new PostResponse(
                10L, 1L, "Aluno", null, "Título", "Texto do post", "Dúvida", "Física", 0, 0, LocalDateTime.now()
        );

        when(postService.listarPorMateria("Física")).thenReturn(List.of(response));

        mockMvc.perform(get("/api/posts").param("materia", "Física"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].materia").value("Física"));
    }

    @Test
    void shouldReturnPostsFilteredByCategoria() throws Exception {
        PostResponse response = new PostResponse(
                10L, 1L, "Aluno", null, "Título", "Texto do post", "Resumo", "História", 0, 0, LocalDateTime.now()
        );

        when(postService.listarPorCategoria("Resumo")).thenReturn(List.of(response));

        mockMvc.perform(get("/api/posts").param("categoria", "Resumo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoria").value("Resumo"));
    }

    @Test
    void shouldReturnPostsFilteredByUsuarioId() throws Exception {
        PostResponse response = new PostResponse(
                10L, 1L, "Aluno", null, "Título", "Texto do post", "Dúvida", "História", 0, 0, LocalDateTime.now()
        );

        when(postService.listarPorUsuario(1L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/posts").param("usuarioId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].usuarioId").value(1L));
    }

    @Test
    void shouldReturnNoContentWhenReportingPost() throws Exception {
        doNothing().when(postService).denunciar(10L);

        mockMvc.perform(post("/api/posts/10/denunciar"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnOkWhenUpdatingPost() throws Exception {
        PostUpdateRequest updateRequest = new PostUpdateRequest("Título Editado", "Texto novo", "Resumo", "História");
        PostResponse response = new PostResponse(
                10L, 1L, "Aluno", null, "Título Editado", "Texto novo", "Resumo", "História", 0, 0, LocalDateTime.now()
        );

        when(postService.editar(eq(10L), any(), any(Boolean.class), any())).thenReturn(response);

        mockMvc.perform(put("/api/posts/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.titulo").value("Título Editado"));
    }

    @Test
    void shouldReturnNoContentWhenDeletingPost() throws Exception {
        doNothing().when(postService).remover(10L);

        mockMvc.perform(delete("/api/posts/10"))
                .andExpect(status().isNoContent());
    }
}

