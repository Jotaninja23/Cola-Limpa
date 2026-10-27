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
import java.util.List;
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
    void shouldThrowExceptionWhenPhoneAlreadyExists() {
        UsuarioRequest request = new UsuarioRequest("Aluno Teste", null, "11999999999", null, 60);

        when(usuarioRepository.existsByTelefone("11999999999")).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.cadastrar(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O telefone informado já está em uso.");
    }

    @Test
    void shouldReturnUserResponseWhenFoundById() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        UsuarioResponse response = usuarioService.buscarPorId(1L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Aluno Teste");
    }

    @Test
    void shouldThrowExceptionWhenUserNotFoundById() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.buscarPorId(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado com id: 99");
    }

    @Test
    void shouldListAllUsers() {
        when(usuarioRepository.findAll()).thenReturn(List.of(usuario));

        List<UsuarioResponse> list = usuarioService.listarTodos();

        assertThat(list).hasSize(1);
        assertThat(list.get(0).nome()).isEqualTo("Aluno Teste");
    }

    @Test
    void shouldUpdateUserProfileSuccessfully() {
        UsuarioRequest request = new UsuarioRequest("Novo Nome", "aluno@email.com", "11999999999", "http://foto.png", 90);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        UsuarioResponse response = usuarioService.atualizarPerfil(1L, request);

        assertThat(response).isNotNull();
        assertThat(usuario.getNome()).isEqualTo("Novo Nome");
        assertThat(usuario.getMetaDiariaMinutos()).isEqualTo(90);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingToAlreadyTakenEmail() {
        UsuarioRequest request = new UsuarioRequest("Novo Nome", "outro@email.com", null, null, 60);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.existsByEmail("outro@email.com")).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.atualizarPerfil(1L, request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O e-mail informado já está em uso.");
    }

    @Test
    void shouldThrowExceptionWhenUpdatingToAlreadyTakenPhone() {
        UsuarioRequest request = new UsuarioRequest("Novo Nome", null, "11888888888", null, 60);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.existsByTelefone("11888888888")).thenReturn(true);

        assertThatThrownBy(() -> usuarioService.atualizarPerfil(1L, request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("O telefone informado já está em uso.");
    }

    @Test
    void shouldAddXpSuccessfully() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        usuarioService.adicionarXp(1L, 50);

        assertThat(usuario.getXp()).isEqualTo(50);
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void shouldDeleteUserSuccessfully() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        usuarioService.excluir(1L);

        verify(usuarioRepository).delete(usuario);
    }
}
