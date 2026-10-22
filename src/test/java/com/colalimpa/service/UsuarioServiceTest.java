package com.colalimpa.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.colalimpa.dto.UsuarioRequest;
import com.colalimpa.dto.UsuarioResponse;
import com.colalimpa.exception.BusinessRuleException;
import com.colalimpa.exception.ResourceNotFoundException;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.UsuarioRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno Teste", "aluno@email.com", "11999999999", null, 60);
        usuario.setId(1L);
    }

    @Test
    void shouldCreateUserSuccessfullyWhenDataIsValid() {
        UsuarioRequest request = new UsuarioRequest("Aluno Teste", "aluno@email.com", "11999999999", null, 60);

        when(usuarioRepository.existsByEmail(request.email())).thenReturn(false);
        when(usuarioRepository.existsByTelefone(request.telefone())).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioResponse response = usuarioService.cadastrar(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.email()).isEqualTo("aluno@email.com");
    }

    @Test
    void shouldThrowExceptionWhenNeitherEmailNorPhoneIsProvided() {
        UsuarioRequest request = new UsuarioRequest("Aluno Teste", null, null, null, 60);

        assertThatThrownBy(() -> usuarioService.cadastrar(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("É necessário informar ao menos um e-mail ou telefone.");
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        UsuarioRequest request = new UsuarioRequest("Aluno Teste", "aluno@email.com", null, null, 60);

        when(usuarioRepository.existsByEmail("aluno@email.com")).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.cadastrar(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O e-mail informado já está em uso.");
    }

    @Test
    void shouldThrowExceptionWhenUserNotFoundById() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.buscarPorId(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado com id: 99");
    }

    @Test
    void shouldAddXpSuccessfully() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        usuarioService.adicionarXp(1L, 50);

        assertThat(usuario.getXp()).isEqualTo(50);
        verify(usuarioRepository).save(usuario);
    }
}

