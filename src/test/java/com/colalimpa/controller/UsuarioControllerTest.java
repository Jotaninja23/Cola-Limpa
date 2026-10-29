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

import com.colalimpa.dto.UsuarioRequest;
import com.colalimpa.dto.UsuarioResponse;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.service.UsuarioService;
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
        controllers = UsuarioController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UsuarioService usuarioService;

    @Test
    void shouldReturnCreatedWhenCreatingUserWithValidData() throws Exception {
        UsuarioRequest request = new UsuarioRequest("Aluno Teste", "aluno@email.com", null, null, 60);
        UsuarioResponse response = new UsuarioResponse(
                1L, "Aluno Teste", "aluno@email.com", null, null, 0, 60, false, LocalDateTime.now()
        );

        when(usuarioService.cadastrar(any())).thenReturn(response);

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/usuarios/1"))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nome").value("Aluno Teste"));
    }

    @Test
    void shouldReturnBadRequestWhenCreatingUserWithBlankName() throws Exception {
        UsuarioRequest request = new UsuarioRequest("", "aluno@email.com", null, null, 60);

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnOkWhenUserFoundById() throws Exception {
        UsuarioResponse response = new UsuarioResponse(
                1L, "Aluno Teste", "aluno@email.com", null, null, 0, 60, false, LocalDateTime.now()
        );

        when(usuarioService.buscarPorId(1L)).thenReturn(response);

        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nome").value("Aluno Teste"));
    }

    @Test
    void shouldReturnNotFoundWhenUserDoesNotExistById() throws Exception {
        when(usuarioService.buscarPorId(99L)).thenThrow(new ResourceNotFoundException("Usuário não encontrado com id: 99"));

        mockMvc.perform(get("/api/usuarios/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Usuário não encontrado com id: 99"));
    }

    @Test
    void shouldReturnListOfUsers() throws Exception {
        UsuarioResponse response = new UsuarioResponse(
                1L, "Aluno Teste", "aluno@email.com", null, null, 0, 60, false, LocalDateTime.now()
        );

        when(usuarioService.listarTodos()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void shouldReturnOkWhenUpdatingUserProfile() throws Exception {
        UsuarioRequest request = new UsuarioRequest("Novo Nome", "aluno@email.com", null, null, 90);
        UsuarioResponse response = new UsuarioResponse(
                1L, "Novo Nome", "aluno@email.com", null, null, 0, 90, false, LocalDateTime.now()
        );

        when(usuarioService.atualizarPerfil(eq(1L), any())).thenReturn(response);

        mockMvc.perform(put("/api/usuarios/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Novo Nome"));
    }

    @Test
    void shouldReturnNoContentWhenDeletingUser() throws Exception {
        doNothing().when(usuarioService).excluir(1L);

        mockMvc.perform(delete("/api/usuarios/1"))
                .andExpect(status().isNoContent());
    }
}

