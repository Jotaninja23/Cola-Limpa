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
import java.util.List;
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
    void shouldRegisterPauseSessionAndGrantBonusXp() {
        CronometroHistoricoRequest request = new CronometroHistoricoRequest(1L, 300, "PAUSA");
        CronometroHistorico historico = new CronometroHistorico(usuario, 300, "PAUSA");
        historico.setId(6L);

        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(cronometroHistoricoRepository.save(any(CronometroHistorico.class))).thenReturn(historico);

        CronometroHistoricoResponse response = cronometroService.registrarSessao(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(6L);
        assertThat(response.xpGanho()).isEqualTo(11);
        assertThat(usuario.getXp()).isEqualTo(11);
    }

    @Test
    void shouldRegisterFreeStudySessionWithProportionalXp() {
        CronometroHistoricoRequest request = new CronometroHistoricoRequest(1L, 540, "LIVRE");
        CronometroHistorico historico = new CronometroHistorico(usuario, 540, "LIVRE");
        historico.setId(7L);

        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(cronometroHistoricoRepository.save(any(CronometroHistorico.class))).thenReturn(historico);

        CronometroHistoricoResponse response = cronometroService.registrarSessao(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(7L);
        assertThat(response.xpGanho()).isEqualTo(3);
        assertThat(usuario.getXp()).isEqualTo(3);
    }

    @Test
    void shouldThrowExceptionWhenStudyTimeExceeds16Hours() {
        CronometroHistoricoRequest request = new CronometroHistoricoRequest(1L, 57601, "LIVRE");

        assertThatThrownBy(() -> cronometroService.registrarSessao(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O tempo contínuo de estudo excede o limite biológico seguro de 16 horas.");
    }

    @Test
    void shouldListStudyHistoryByUserId() {
        CronometroHistorico historico = new CronometroHistorico(usuario, 1500, "POMODORO");
        historico.setId(5L);

        when(usuarioService.buscarEntidadePorId(1L)).thenReturn(usuario);
        when(cronometroHistoricoRepository.findByUsuarioIdOrderByDataCriacaoDesc(1L)).thenReturn(List.of(historico));

        List<CronometroHistoricoResponse> list = cronometroService.listarHistoricoPorUsuario(1L);

        assertThat(list).hasSize(1);
        assertThat(list.get(0).id()).isEqualTo(5L);
        assertThat(list.get(0).tempoSegundos()).isEqualTo(1500);
    }
}
