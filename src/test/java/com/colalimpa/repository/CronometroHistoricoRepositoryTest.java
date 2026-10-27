package com.colalimpa.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.colalimpa.model.CronometroHistorico;
import com.colalimpa.model.Usuario;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CronometroHistoricoRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CronometroHistoricoRepository cronometroHistoricoRepository;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("Aluno Focado", "focado@email.com", null, null, 60);
        entityManager.persistAndFlush(usuario);
    }

    @Test
    void shouldFindHistoryByUsuarioIdOrderByDataCriacaoDesc() {
        CronometroHistorico s1 = new CronometroHistorico(usuario, 1500, "POMODORO");
        CronometroHistorico s2 = new CronometroHistorico(usuario, 300, "PAUSA");

        entityManager.persist(s1);
        entityManager.persist(s2);
        entityManager.flush();

        List<CronometroHistorico> historico = cronometroHistoricoRepository
                .findByUsuarioIdOrderByDataCriacaoDesc(usuario.getId());

        assertThat(historico).hasSize(2);
        assertThat(historico.get(0).getTipoSessao()).isEqualTo("PAUSA");
        assertThat(historico.get(0).getUsuario()).isNotNull();
    }

    @Test
    void shouldFindHistoryByUsuarioIdAndDateBetween() {
        CronometroHistorico sessao = new CronometroHistorico(usuario, 1500, "POMODORO");
        entityManager.persistAndFlush(sessao);

        LocalDateTime inicio = LocalDateTime.now().minusHours(1);
        LocalDateTime fim = LocalDateTime.now().plusHours(1);

        List<CronometroHistorico> resultado = cronometroHistoricoRepository
                .findByUsuarioIdAndDataCriacaoBetweenOrderByDataCriacaoAsc(usuario.getId(), inicio, fim);

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getTempoSegundos()).isEqualTo(1500);
    }
}
