package com.colalimpa.service;

import com.colalimpa.dto.PostRequest;
import com.colalimpa.dto.PostResponse;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.model.Post;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.PostRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PostService {

    private static final int LIMITE_DENUNCIAS_OCULTACAO = 5;

    private final PostRepository postRepository;
    private final UsuarioService usuarioService;

    public PostService(PostRepository postRepository, UsuarioService usuarioService) {
        this.postRepository = postRepository;
        this.usuarioService = usuarioService;
    }

    public PostResponse criar(Long usuarioId, PostRequest request) {
        Usuario usuario = usuarioService.buscarEntidadePorId(usuarioId);
        Post post = new Post(
                usuario,
                request.titulo(),
                request.texto(),
                request.categoria(),
                request.materia()
        );
        Post salvo = postRepository.save(post);
        return PostResponse.fromEntity(salvo);
    }

    public PostResponse criar(PostRequest request) {
        return criar(request.usuarioId(), request);
    }

    @Transactional(readOnly = true)
    public PostResponse buscarPorId(Long id) {
        Post post = buscarEntidadePorId(id);
        return PostResponse.fromEntity(post);
    }

    @Transactional(readOnly = true)
    public Post buscarEntidadePorId(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post não encontrado com id: " + id));
    }

    @Transactional(readOnly = true)
    public List<PostResponse> listarFeedPublico() {
        return postRepository.findByQtDenunciasLessThanOrderByDataCriacaoDesc(LIMITE_DENUNCIAS_OCULTACAO)
                .stream()
                .map(PostResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostResponse> listarPorMateria(String materia) {
        return postRepository.findByMateria(materia)
                .stream()
                .map(PostResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostResponse> listarPorCategoria(String categoria) {
        return postRepository.findByCategoria(categoria)
                .stream()
                .map(PostResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostResponse> listarPorUsuario(Long usuarioId) {
        return postRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId)
                .stream()
                .map(PostResponse::fromEntity)
                .toList();
    }

    public void denunciar(Long id) {
        Post post = buscarEntidadePorId(id);
        post.incrementarDenuncias();
        postRepository.save(post);
    }

    public void remover(Long id) {
        Post post = buscarEntidadePorId(id);
        postRepository.delete(post);
    }
}

