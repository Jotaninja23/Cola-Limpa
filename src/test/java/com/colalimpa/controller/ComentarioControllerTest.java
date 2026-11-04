package com.colalimpa.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.colalimpa.dto.ComentarioRequest;
import com.colalimpa.dto.ComentarioResponse;
import com.colalimpa.service.ComentarioService;
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
        controllers = ComentarioController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class ComentarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ComentarioService comentarioService;

    @Test
    void shouldReturnCreatedWhenCreatingValidComment() throws Exception {
        ComentarioRequest request = new ComentarioRequest(10L, 1L, "Ótimo post!");
        ComentarioResponse response = new ComentarioResponse(
                50L, 10L, 1L, "Aluno", null, "Ótimo post!", 0, 0, LocalDateTime.now()
        );

        when(comentarioService.criar(any())).thenReturn(response);

        mockMvc.perform(post("/api/comentarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/comentarios/50"))
                .andExpect(jsonPath("$.id").value(50L))
                .andExpect(jsonPath("$.texto").value("Ótimo post!"));
    }

    @Test
    void shouldReturnBadRequestWhenCreatingCommentWithBlankText() throws Exception {
        ComentarioRequest request = new ComentarioRequest(10L, 1L, "");

        mockMvc.perform(post("/api/comentarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnBadRequestWhenCreatingCommentWithExcessiveText() throws Exception {
        String textoLongo = "a".repeat(1001);
        ComentarioRequest request = new ComentarioRequest(10L, 1L, textoLongo);

        mockMvc.perform(post("/api/comentarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnCommentsListByPost() throws Exception {
        ComentarioResponse response = new ComentarioResponse(
                50L, 10L, 1L, "Aluno", null, "Ótimo post!", 0, 0, LocalDateTime.now()
        );

        when(comentarioService.listarPorPost(10L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/comentarios/post/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(50L));
    }

    @Test
    void shouldReturnNoContentWhenReportingComment() throws Exception {
        doNothing().when(comentarioService).denunciar(50L);

        mockMvc.perform(post("/api/comentarios/50/denunciar"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnNoContentWhenDeletingComment() throws Exception {
        doNothing().when(comentarioService).remover(50L);

        mockMvc.perform(delete("/api/comentarios/50"))
                .andExpect(status().isNoContent());
    }
}

