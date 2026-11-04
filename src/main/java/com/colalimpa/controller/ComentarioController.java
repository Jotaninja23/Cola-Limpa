package com.colalimpa.controller;

import com.colalimpa.dto.ComentarioRequest;
import com.colalimpa.dto.ComentarioResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.security.CurrentUser;
import com.colalimpa.security.UsuarioPrincipal;
import com.colalimpa.service.ComentarioService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comentarios")
public class ComentarioController {

    private final ComentarioService comentarioService;

    public ComentarioController(ComentarioService comentarioService) {
        this.comentarioService = comentarioService;
    }

    @PostMapping
    public ResponseEntity<ComentarioResponse> criar(
            @CurrentUser UsuarioPrincipal principal,
            @Valid @RequestBody ComentarioRequest request
    ) {
        Long usuarioId = principal != null ? principal.getId() : request.usuarioId();
        if (usuarioId == null) {
            throw new BusinessRuleException("Identificador do usuário autor não informado.");
        }
        ComentarioRequest finalRequest = (principal != null && !principal.getId().equals(request.usuarioId()))
                ? new ComentarioRequest(request.postId(), principal.getId(), request.texto())
                : request;
        ComentarioResponse response = comentarioService.criar(finalRequest);
        URI uri = URI.create("/api/comentarios/" + response.id());
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ComentarioResponse>> listarPorPost(@PathVariable Long postId) {
        return ResponseEntity.ok(comentarioService.listarPorPost(postId));
    }

    @PostMapping("/{id}/denunciar")
    public ResponseEntity<Void> denunciar(@PathVariable Long id) {
        comentarioService.denunciar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(
            @CurrentUser UsuarioPrincipal principal,
            @PathVariable Long id
    ) {
        if (principal != null) {
            comentarioService.remover(id, principal.getId(), principal.isAdmin());
        } else {
            comentarioService.remover(id);
        }
        return ResponseEntity.noContent().build();
    }
}

