package com.colalimpa.controller;

import com.colalimpa.dto.CronometroHistoricoRequest;
import com.colalimpa.dto.CronometroHistoricoResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.security.CurrentUser;
import com.colalimpa.security.UsuarioPrincipal;
import com.colalimpa.service.CronometroService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cronometro")
public class CronometroController {

    private final CronometroService cronometroService;

    public CronometroController(CronometroService cronometroService) {
        this.cronometroService = cronometroService;
    }

    @PostMapping
    public ResponseEntity<CronometroHistoricoResponse> registrarSessao(
            @CurrentUser UsuarioPrincipal principal,
            @Valid @RequestBody CronometroHistoricoRequest request
    ) {
        Long usuarioId = principal != null ? principal.getId() : request.usuarioId();
        if (usuarioId == null) {
            throw new BusinessRuleException("Identificador do usuário autor não informado.");
        }
        CronometroHistoricoRequest finalRequest = new CronometroHistoricoRequest(usuarioId, request.tempoSegundos(), request.tipoSessao());
        CronometroHistoricoResponse response = cronometroService.registrarSessao(finalRequest);
        URI uri = URI.create("/api/cronometro/" + response.id());
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<CronometroHistoricoResponse>> listarHistorico(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(cronometroService.listarHistoricoPorUsuario(usuarioId));
    }
}

