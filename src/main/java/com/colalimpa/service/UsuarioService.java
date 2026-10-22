package com.colalimpa.service;

import com.colalimpa.dto.UsuarioRequest;
import com.colalimpa.dto.UsuarioResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.UsuarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioResponse cadastrar(UsuarioRequest request) {
        if (request.email() == null && request.telefone() == null) {
            throw new BusinessRuleException("É necessário informar ao menos um e-mail ou telefone.");
        }

        if (request.email() != null && usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException("O e-mail informado já está em uso.");
        }

        if (request.telefone() != null && usuarioRepository.existsByTelefone(request.telefone())) {
            throw new BusinessRuleException("O telefone informado já está em uso.");
        }

        Usuario usuario = new Usuario(
                request.nome(),
                request.email(),
                request.telefone(),
                request.fotoUrl(),
                request.metaDiariaMinutos()
        );

        Usuario salvo = usuarioRepository.save(usuario);
        return UsuarioResponse.fromEntity(salvo);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuario = buscarEntidadePorId(id);
        return UsuarioResponse.fromEntity(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario buscarEntidadePorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
    }

    public UsuarioResponse atualizarPerfil(Long id, UsuarioRequest request) {
        Usuario usuario = buscarEntidadePorId(id);

        if (request.email() != null && !request.email().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(request.email())) {
                throw new BusinessRuleException("O e-mail informado já está em uso.");
            }
            usuario.setEmail(request.email());
        }

        if (request.telefone() != null && !request.telefone().equals(usuario.getTelefone())) {
            if (usuarioRepository.existsByTelefone(request.telefone())) {
                throw new BusinessRuleException("O telefone informado já está em uso.");
            }
            usuario.setTelefone(request.telefone());
        }

        usuario.setNome(request.nome());
        usuario.setFotoUrl(request.fotoUrl());
        usuario.setMetaDiariaMinutos(request.metaDiariaMinutos());

        Usuario atualizado = usuarioRepository.save(usuario);
        return UsuarioResponse.fromEntity(atualizado);
    }

    public void adicionarXp(Long id, int pontos) {
        Usuario usuario = buscarEntidadePorId(id);
        usuario.adicionarXp(pontos);
        usuarioRepository.save(usuario);
    }

    public void excluir(Long id) {
        Usuario usuario = buscarEntidadePorId(id);
        usuarioRepository.delete(usuario);
    }
}

