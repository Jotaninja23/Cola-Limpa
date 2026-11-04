package com.colalimpa.controller;

import com.colalimpa.dto.PostRequest;
import com.colalimpa.dto.PostResponse;
import com.colalimpa.dto.PostUpdateRequest;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.security.CurrentUser;
import com.colalimpa.security.UsuarioPrincipal;
import com.colalimpa.service.PostService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> criar(
            @CurrentUser UsuarioPrincipal principal,
            @Valid @RequestBody PostRequest request
    ) {
        Long usuarioId = principal != null ? principal.getId() : request.usuarioId();
        if (usuarioId == null) {
            throw new BusinessRuleException("Identificador do usuário autor não informado.");
        }
        PostRequest finalRequest = (principal != null && !principal.getId().equals(request.usuarioId()))
                ? new PostRequest(principal.getId(), request.titulo(), request.texto(), request.categoria(), request.materia())
                : request;
        PostResponse response = postService.criar(finalRequest);
        URI uri = URI.create("/api/posts/" + response.id());
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(postService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> listar(
            @RequestParam(required = false) String materia,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Long usuarioId
    ) {
        if (materia != null && !materia.isBlank()) {
            return ResponseEntity.ok(postService.listarPorMateria(materia));
        }
        if (categoria != null && !categoria.isBlank()) {
            return ResponseEntity.ok(postService.listarPorCategoria(categoria));
        }
        if (usuarioId != null) {
            return ResponseEntity.ok(postService.listarPorUsuario(usuarioId));
        }
        return ResponseEntity.ok(postService.listarFeedPublico());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> editar(
            @CurrentUser UsuarioPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateRequest request
    ) {
        Long usuarioId = principal != null ? principal.getId() : null;
        boolean isAdmin = principal != null && principal.isAdmin();
        return ResponseEntity.ok(postService.editar(id, usuarioId, isAdmin, request));
    }

    @PostMapping("/{id}/denunciar")
    public ResponseEntity<Void> denunciar(@PathVariable Long id) {
        postService.denunciar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(
            @CurrentUser UsuarioPrincipal principal,
            @PathVariable Long id
    ) {
        if (principal != null) {
            postService.remover(id, principal.getId(), principal.isAdmin());
        } else {
            postService.remover(id);
        }
        return ResponseEntity.noContent().build();
    }
}

