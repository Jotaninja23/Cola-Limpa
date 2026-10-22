package com.colalimpa.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.colalimpa.dto.CronometroHistoricoRequest;
import com.colalimpa.dto.CronometroHistoricoResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.model.CronometroHistorico;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.CronometroHistoricoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CronometroServiceTest {

    @Mock
    private CronometroHistoricoRepository cronometroHistoricoRepository;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private CronometroService cronometroService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno", "aluno@email.com", null, null, null);
        usuario.setId(1L);
    }

    @Test
    void shouldRegisterPomodoroSessionAndGrantBonusXp() {
        CronometroHistoricoRequest request = new CronometroHistoricoRequest(1L, 1500, "POMODORO");
        CronometroHistorico historico = new CronometroHistorico(usuario, 1500, "POMODORO");
        historico.setId(5L);

        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(cronometroHistoricoRepository.save(any(CronometroHistorico.class))).thenReturn(historico);

        CronometroHistoricoResponse response = cronometroService.registrarSessao(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(5L);
        assertThat(response.xpGanho()).isEqualTo(33);
        assertThat(usuario.getXp()).isEqualTo(33);
    }

    @Test
    void shouldThrowExceptionWhenStudyTimeExceeds16Hours() {
        CronometroHistoricoRequest request = new CronometroHistoricoRequest(1L, 57601, "LIVRE");

        assertThatThrownBy(() -> cronometroService.registrarSessao(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O tempo contínuo de estudo excede o limite biológico seguro de 16 horas.");
    }
}

