package com.colalimpa.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.colalimpa.dto.LikeRequest;
import com.colalimpa.dto.LikeResponse;
import com.colalimpa.service.LikeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(LikeController.class)
class LikeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LikeService likeService;

    @Test
    void shouldReturnCreatedWhenLikingPost() throws Exception {
        LikeRequest request = new LikeRequest(1L, 10L, null);
        LikeResponse response = new LikeResponse(100L, 1L, 10L, null, LocalDateTime.now());

        when(likeService.curtir(any())).thenReturn(response);

        mockMvc.perform(post("/api/likes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/likes/100"))
                .andExpect(jsonPath("$.id").value(100L));
    }

    @Test
    void shouldReturnBadRequestWhenLikingWithoutUserId() throws Exception {
        LikeRequest request = new LikeRequest(null, 10L, null);

        mockMvc.perform(post("/api/likes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnNoContentWhenUnlikingPost() throws Exception {
        doNothing().when(likeService).descurtirPost(1L, 10L);

        mockMvc.perform(delete("/api/likes/post/10").param("usuarioId", "1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnNoContentWhenUnlikingComment() throws Exception {
        doNothing().when(likeService).descurtirComentario(1L, 20L);

        mockMvc.perform(delete("/api/likes/comentario/20").param("usuarioId", "1"))
                .andExpect(status().isNoContent());
    }
}

