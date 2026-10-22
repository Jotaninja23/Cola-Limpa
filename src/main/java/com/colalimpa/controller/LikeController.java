package com.colalimpa.controller;

import com.colalimpa.dto.LikeRequest;
import com.colalimpa.dto.LikeResponse;
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
    public ResponseEntity<LikeResponse> curtir(@Valid @RequestBody LikeRequest request) {
        LikeResponse response = likeService.curtir(request);
        URI uri = URI.create("/api/likes/" + response.id());
        return ResponseEntity.created(uri).body(response);
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> descurtirPost(
            @PathVariable Long postId,
            @RequestParam Long usuarioId
    ) {
        likeService.descurtirPost(usuarioId, postId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/comentario/{comentarioId}")
    public ResponseEntity<Void> descurtirComentario(
            @PathVariable Long comentarioId,
            @RequestParam Long usuarioId
    ) {
        likeService.descurtirComentario(usuarioId, comentarioId);
        return ResponseEntity.noContent().build();
    }
}

