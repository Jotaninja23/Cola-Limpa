package com.colalimpa.controller;

import com.colalimpa.dto.LikeRequest;
import com.colalimpa.dto.LikeResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.security.CurrentUser;
import com.colalimpa.security.UsuarioPrincipal;
import com.colalimpa.service.LikeService;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<LikeResponse> curtir(
            @CurrentUser UsuarioPrincipal principal,
            @Valid @RequestBody LikeRequest request
    ) {
        LikeRequest finalRequest = (principal != null && !principal.getId().equals(request.usuarioId()))
                ? new LikeRequest(principal.getId(), request.postId(), request.comentarioId())
                : request;
        LikeResponse response = likeService.curtir(finalRequest);
        URI uri = URI.create("/api/likes/" + response.id());
        return ResponseEntity.created(uri).body(response);
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> descurtirPost(
            @CurrentUser UsuarioPrincipal principal,
            @PathVariable Long postId,
            @RequestParam(required = false) Long usuarioId
    ) {
        Long finalUsuarioId = principal != null ? principal.getId() : usuarioId;
        if (finalUsuarioId == null) {
            throw new BusinessRuleException("Identificador do usuário não informado.");
        }
        likeService.descurtirPost(finalUsuarioId, postId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/comentario/{comentarioId}")
    public ResponseEntity<Void> descurtirComentario(
            @CurrentUser UsuarioPrincipal principal,
            @PathVariable Long comentarioId,
            @RequestParam(required = false) Long usuarioId
    ) {
        Long finalUsuarioId = principal != null ? principal.getId() : usuarioId;
        if (finalUsuarioId == null) {
            throw new BusinessRuleException("Identificador do usuário não informado.");
        }
        likeService.descurtirComentario(finalUsuarioId, comentarioId);
        return ResponseEntity.noContent().build();
    }
}

