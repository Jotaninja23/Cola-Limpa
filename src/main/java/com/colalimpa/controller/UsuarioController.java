package com.colalimpa.controller;

import com.colalimpa.dto.UsuarioRequest;
import com.colalimpa.dto.UsuarioResponse;
import com.colalimpa.security.CurrentUser;
import com.colalimpa.security.UsuarioPrincipal;
import com.colalimpa.service.UsuarioService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> obterPerfilAtual(@CurrentUser UsuarioPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(usuarioService.buscarPorId(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> cadastrar(@Valid @RequestBody UsuarioRequest request) {
        UsuarioResponse response = usuarioService.cadastrar(request);
        URI uri = URI.create("/api/usuarios/" + response.id());
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarPerfil(
            @CurrentUser UsuarioPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequest request
    ) {
        if (principal != null && !principal.isAdmin() && !principal.getId().equals(id)) {
            throw new AccessDeniedException("Você não tem permissão para atualizar os dados deste usuário.");
        }
        return ResponseEntity.ok(usuarioService.atualizarPerfil(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @CurrentUser UsuarioPrincipal principal,
            @PathVariable Long id
    ) {
        if (principal != null && !principal.isAdmin() && !principal.getId().equals(id)) {
            throw new AccessDeniedException("Você não tem permissão para excluir este usuário.");
        }
        usuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}

