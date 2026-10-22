package com.colalimpa.controller;

import com.colalimpa.dto.SolicitarCodigoRequest;
import com.colalimpa.dto.TokenResponse;
import com.colalimpa.dto.ValidarCodigoRequest;
import com.colalimpa.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/solicitar-codigo")
    public ResponseEntity<Void> solicitarCodigo(@Valid @RequestBody SolicitarCodigoRequest request) {
        authService.solicitarCodigo(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/validar-codigo")
    public ResponseEntity<TokenResponse> validarCodigo(@Valid @RequestBody ValidarCodigoRequest request) {
        return ResponseEntity.ok(authService.validarCodigo(request));
    }
}

