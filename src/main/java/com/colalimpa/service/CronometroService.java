package com.colalimpa.service;

import com.colalimpa.dto.CronometroHistoricoRequest;
import com.colalimpa.dto.CronometroHistoricoResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.model.CronometroHistorico;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.CronometroHistoricoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CronometroService {

    private static final int TEMPO_MAXIMO_SEGUNDOS = 57600;
    private static final int SEGUNDOS_POR_PONTO_XP = 180;
    private static final int BONUS_XP_BLOCO_POMODORO = 25;
    private static final int BONUS_XP_PAUSA_POMODORO = 10;
    private static final int TEMPO_MINIMO_POMODORO_SEGUNDOS = 1500;

    private final CronometroHistoricoRepository cronometroHistoricoRepository;
    private final UsuarioService usuarioService;

    public CronometroService(
            CronometroHistoricoRepository cronometroHistoricoRepository,
            UsuarioService usuarioService
    ) {
        this.cronometroHistoricoRepository = cronometroHistoricoRepository;
        this.usuarioService = usuarioService;
    }

    public CronometroHistoricoResponse registrarSessao(Long usuarioId, CronometroHistoricoRequest request) {
        if (request.tempoSegundos() > TEMPO_MAXIMO_SEGUNDOS) {
            throw new BusinessRuleException("O tempo contínuo de estudo excede o limite biológico seguro de 16 horas.");
        }

        Usuario usuario = usuarioService.buscarEntidadePorId(usuarioId);

        int xpCalculado = calcularXp(request.tempoSegundos(), request.tipoSessao());
        if (xpCalculado > 0) {
            usuario.adicionarXp(xpCalculado);
        }

        CronometroHistorico historico = new CronometroHistorico(
                usuario,
                request.tempoSegundos(),
                request.tipoSessao()
        );

        CronometroHistorico salvo = cronometroHistoricoRepository.save(historico);
        return CronometroHistoricoResponse.fromEntity(salvo, xpCalculado);
    }

    public CronometroHistoricoResponse registrarSessao(CronometroHistoricoRequest request) {
        return registrarSessao(request.usuarioId(), request);
    }

    @Transactional(readOnly = true)
    public List<CronometroHistoricoResponse> listarHistoricoPorUsuario(Long usuarioId) {
        usuarioService.buscarEntidadePorId(usuarioId);
        return cronometroHistoricoRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId)
                .stream()
                .map(item -> CronometroHistoricoResponse.fromEntity(item, 0))
                .toList();
    }

    private int calcularXp(int tempoSegundos, String tipoSessao) {
        int xpBase = tempoSegundos / SEGUNDOS_POR_PONTO_XP;
        int bonus = 0;

        if ("POMODORO".equalsIgnoreCase(tipoSessao) && tempoSegundos >= TEMPO_MINIMO_POMODORO_SEGUNDOS) {
            bonus += BONUS_XP_BLOCO_POMODORO;
        } else if ("PAUSA".equalsIgnoreCase(tipoSessao)) {
            bonus += BONUS_XP_PAUSA_POMODORO;
        }

        return xpBase + bonus;
    }
}

