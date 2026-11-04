package com.colalimpa.controller;

import com.colalimpa.dto.ComentarioResponse;
import com.colalimpa.dto.PostResponse;
import com.colalimpa.service.ComentarioService;
import com.colalimpa.service.PostService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/moderacao")
@PreAuthorize("hasRole('ADMIN')")
public class ModeracaoController {

    private final PostService postService;
    private final ComentarioService comentarioService;

    public ModeracaoController(PostService postService, ComentarioService comentarioService) {
        this.postService = postService;
        this.comentarioService = comentarioService;
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostResponse>> listarPostsOcultados() {
        return ResponseEntity.ok(postService.listarOcultadosPorDenuncia());
    }

    @PostMapping("/posts/{id}/aprovar")
    public ResponseEntity<PostResponse> aprovarPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.aprovarPublicacao(id));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> removerPostDefinitivo(@PathVariable Long id) {
        postService.remover(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/comentarios")
    public ResponseEntity<List<ComentarioResponse>> listarComentariosOcultados() {
        return ResponseEntity.ok(comentarioService.listarOcultadosPorDenuncia());
    }

    @PostMapping("/comentarios/{id}/aprovar")
    public ResponseEntity<ComentarioResponse> aprovarComentario(@PathVariable Long id) {
        return ResponseEntity.ok(comentarioService.aprovarComentario(id));
    }

    @DeleteMapping("/comentarios/{id}")
    public ResponseEntity<Void> removerComentarioDefinitivo(@PathVariable Long id) {
        comentarioService.remover(id);
        return ResponseEntity.noContent().build();
    }
}

