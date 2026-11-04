package com.colalimpa.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.colalimpa.dto.CronometroHistoricoRequest;
import com.colalimpa.dto.CronometroHistoricoResponse;
import com.colalimpa.service.CronometroService;
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
        controllers = CronometroController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class CronometroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CronometroService cronometroService;

    @Test
    void shouldReturnCreatedWhenRegisteringValidSession() throws Exception {
        CronometroHistoricoRequest request = new CronometroHistoricoRequest(1L, 1500, "POMODORO");
        CronometroHistoricoResponse response = new CronometroHistoricoResponse(
                5L, 1L, 1500, "POMODORO", 33, LocalDateTime.now()
        );

        when(cronometroService.registrarSessao(any())).thenReturn(response);

        mockMvc.perform(post("/api/cronometro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/cronometro/5"))
                .andExpect(jsonPath("$.id").value(5L))
                .andExpect(jsonPath("$.xpGanho").value(33));
    }

    @Test
    void shouldReturnBadRequestWhenRegisteringSessionWithZeroSeconds() throws Exception {
        CronometroHistoricoRequest request = new CronometroHistoricoRequest(1L, 0, "POMODORO");

        mockMvc.perform(post("/api/cronometro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnHistoryByUserId() throws Exception {
        CronometroHistoricoResponse response = new CronometroHistoricoResponse(
                5L, 1L, 1500, "POMODORO", 0, LocalDateTime.now()
        );

        when(cronometroService.listarHistoricoPorUsuario(1L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/cronometro/usuario/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(5L))
                .andExpect(jsonPath("$[0].tempoSegundos").value(1500));
    }
}

