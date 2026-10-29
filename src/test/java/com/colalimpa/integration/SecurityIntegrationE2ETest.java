package com.colalimpa.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.colalimpa.dto.PostRequest;
import com.colalimpa.dto.SolicitarCodigoRequest;
import com.colalimpa.dto.ValidarCodigoRequest;
import com.colalimpa.model.CodigoAutenticacao;
import com.colalimpa.model.Usuario;
import com.colalimpa.repository.CodigoAutenticacaoRepository;
import com.colalimpa.repository.UsuarioRepository;
import com.colalimpa.security.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationE2ETest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CodigoAutenticacaoRepository codigoRepository;

    @Autowired
    private com.colalimpa.repository.PostRepository postRepository;

    @Autowired
    private com.colalimpa.repository.LikeRepository likeRepository;

    @Autowired
    private com.colalimpa.repository.ComentarioRepository comentarioRepository;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        likeRepository.deleteAll();
        comentarioRepository.deleteAll();
        postRepository.deleteAll();
        codigoRepository.deleteAll();
        usuarioRepository.deleteAll();
    }

    @Test
    void shouldAllowPublicAccessToPostsFeed() throws Exception {
        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldRejectUnauthenticatedAccessToCreatePostWith401ProblemDetail() throws Exception {
        PostRequest request = new PostRequest(1L, "Título", "Conteúdo do post", "Dúvida", "Matemática");

        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.title").value("Não autenticado"))
                .andExpect(jsonPath("$.type").value("https://colalimpa.com/errors/unauthorized"));
    }

    @Test
    void shouldCompleteFullPasswordlessAuthFlowAndAccessProtectedRoute() throws Exception {
        // 1. Solicita código OTP
        SolicitarCodigoRequest solRequest = new SolicitarCodigoRequest("aluno.e2e@email.com");
        mockMvc.perform(post("/api/auth/solicitar-codigo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(solRequest)))
                .andExpect(status().isOk());

        Usuario usuario = usuarioRepository.findByEmail("aluno.e2e@email.com").orElseThrow();
        CodigoAutenticacao codigoSalvo = codigoRepository
                .findTopByUsuarioIdOrderByDataCriacaoDesc(usuario.getId())
                .orElseThrow();

        // 2. Valida o código OTP e recebe token JWT
        ValidarCodigoRequest valRequest = new ValidarCodigoRequest("aluno.e2e@email.com", codigoSalvo.getCodigo());
        MvcResult valResult = mockMvc.perform(post("/api/auth/validar-codigo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(valRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andReturn();

        JsonNode jsonResponse = objectMapper.readTree(valResult.getResponse().getContentAsString());
        String jwtToken = jsonResponse.get("token").asText();
        assertThat(jwtService.isTokenValido(jwtToken)).isTrue();

        // 3. Acessa endpoint protegido com o token JWT
        PostRequest postRequest = new PostRequest(usuario.getId(), "Post E2E", "Texto do post E2E", "Dúvida", "Física");
        mockMvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Post E2E"));

        // 4. Replay attack: tentar validar o mesmo código novamente deve falhar
        mockMvc.perform(post("/api/auth/validar-codigo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(valRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Violação de regra de negócio"));
    }
}
