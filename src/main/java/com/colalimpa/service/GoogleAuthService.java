package com.colalimpa.service;

import com.colalimpa.dto.TokenResponse;
import com.colalimpa.dto.UsuarioResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.UsuarioRepository;
import com.colalimpa.security.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GoogleAuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final GoogleIdTokenVerifier verifier;

    public GoogleAuthService(
            UsuarioRepository usuarioRepository,
            JwtService jwtService,
            @Value("${google.client-id:}") String googleClientId
    ) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;

        GoogleIdTokenVerifier.Builder builder = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        );

        if (googleClientId != null && !googleClientId.isBlank()) {
            builder.setAudience(Collections.singletonList(googleClientId));
        }

        this.verifier = builder.build();
    }

    public TokenResponse autenticarComGoogle(String idTokenString) {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new BusinessRuleException("Token do Google inválido ou expirado.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String nome = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            if (email == null || email.isBlank()) {
                throw new BusinessRuleException("E-mail não fornecido pelo provedor Google.");
            }

            Usuario usuario = usuarioRepository.findByEmail(email)
                    .map(existente -> {
                        if (pictureUrl != null && !pictureUrl.isBlank() && existente.getFotoUrl() == null) {
                            existente.setFotoUrl(pictureUrl);
                        }
                        if (nome != null && !nome.isBlank() && (existente.getNome() == null || existente.getNome().isBlank())) {
                            existente.setNome(nome);
                        }
                        return usuarioRepository.save(existente);
                    })
                    .orElseGet(() -> {
                        String nomeFinal = (nome != null && !nome.isBlank()) ? nome : email.split("@")[0];
                        Usuario novo = new Usuario(nomeFinal, email, null, pictureUrl, null);
                        return usuarioRepository.save(novo);
                    });

            String token = jwtService.gerarToken(usuario);
            return new TokenResponse(token, UsuarioResponse.fromEntity(usuario));
        } catch (BusinessRuleException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessRuleException("Falha ao autenticar com Google: " + e.getMessage());
        }
    }
}

