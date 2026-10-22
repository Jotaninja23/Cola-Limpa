package com.colalimpa.service;

import com.colalimpa.dto.ComentarioRequest;
import com.colalimpa.dto.ComentarioResponse;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.model.Comentario;
import com.colalimpa.model.Post;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.ComentarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ComentarioService {

    private static final int LIMITE_DENUNCIAS_OCULTACAO = 5;

    private final ComentarioRepository comentarioRepository;
    private final PostService postService;
    private final UsuarioService usuarioService;

    public ComentarioService(
            ComentarioRepository comentarioRepository,
            PostService postService,
            UsuarioService usuarioService
    ) {
        this.comentarioRepository = comentarioRepository;
        this.postService = postService;
        this.usuarioService = usuarioService;
    }

    public ComentarioResponse criar(ComentarioRequest request) {
        Post post = postService.buscarEntidadePorId(request.postId());
        Usuario usuario = usuarioService.buscarEntidadePorId(request.usuarioId());

        Comentario comentario = new Comentario(post, usuario, request.texto());
        Comentario salvo = comentarioRepository.save(comentario);
        return ComentarioResponse.fromEntity(salvo);
    }

    @Transactional(readOnly = true)
    public List<ComentarioResponse> listarPorPost(Long postId) {
        postService.buscarEntidadePorId(postId);
        return comentarioRepository.findByPostIdAndQtDenunciasLessThanOrderByDataCriacaoAsc(
                        postId,
                        LIMITE_DENUNCIAS_OCULTACAO
                )
                .stream()
                .map(ComentarioResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Comentario buscarEntidadePorId(Long id) {
        return comentarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentário não encontrado com id: " + id));
    }

    public void denunciar(Long id) {
        Comentario comentario = buscarEntidadePorId(id);
        comentario.incrementarDenuncias();
        comentarioRepository.save(comentario);
    }

    public void remover(Long id) {
        Comentario comentario = buscarEntidadePorId(id);
        comentarioRepository.delete(comentario);
    }
}

