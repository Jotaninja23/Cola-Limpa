package com.colalimpa.service;

import com.colalimpa.dto.LikeRequest;
import com.colalimpa.dto.LikeResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.model.Comentario;
import com.colalimpa.model.Like;
import com.colalimpa.model.Post;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.LikeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final UsuarioService usuarioService;
    private final PostService postService;
    private final ComentarioService comentarioService;

    public LikeService(
            LikeRepository likeRepository,
            UsuarioService usuarioService,
            PostService postService,
            ComentarioService comentarioService
    ) {
        this.likeRepository = likeRepository;
        this.usuarioService = usuarioService;
        this.postService = postService;
        this.comentarioService = comentarioService;
    }

    public LikeResponse curtir(Long usuarioId, LikeRequest request) {
        boolean postInformado = request.postId() != null;
        boolean comentarioInformado = request.comentarioId() != null;

        if (postInformado == comentarioInformado) {
            throw new BusinessRuleException("O like deve ser associado exatamente a um post ou a um comentário.");
        }

        Usuario usuario = usuarioService.buscarEntidadePorId(usuarioId);

        if (postInformado) {
            if (likeRepository.existsByUsuarioIdAndPostId(usuarioId, request.postId())) {
                throw new BusinessRuleException("O usuário já curtiu esta publicação.");
            }
            Post post = postService.buscarEntidadePorId(request.postId());
            post.incrementarCurtidas();

            Like like = new Like(usuario, post);
            Like salvo = likeRepository.save(like);
            return LikeResponse.fromEntity(salvo);
        } else {
            if (likeRepository.existsByUsuarioIdAndComentarioId(usuarioId, request.comentarioId())) {
                throw new BusinessRuleException("O usuário já curtiu este comentário.");
            }
            Comentario comentario = comentarioService.buscarEntidadePorId(request.comentarioId());
            comentario.incrementarCurtidas();

            Like like = new Like(usuario, comentario);
            Like salvo = likeRepository.save(like);
            return LikeResponse.fromEntity(salvo);
        }
    }

    public LikeResponse curtir(LikeRequest request) {
        return curtir(request.usuarioId(), request);
    }

    public void descurtirPost(Long usuarioId, Long postId) {
        Like like = likeRepository.findByUsuarioIdAndPostId(usuarioId, postId)
                .orElseThrow(() -> new ResourceNotFoundException("Like não encontrado para esta publicação."));

        Post post = like.getPost();
        if (post != null) {
            post.decrementarCurtidas();
        }

        likeRepository.delete(like);
    }

    public void descurtirComentario(Long usuarioId, Long comentarioId) {
        Like like = likeRepository.findByUsuarioIdAndComentarioId(usuarioId, comentarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Like não encontrado para este comentário."));

        Comentario comentario = like.getComentario();
        if (comentario != null) {
            comentario.decrementarCurtidas();
        }

        likeRepository.delete(like);
    }
}

