package com.colalimpa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "comentario")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(name = "qt_curtidas", nullable = false)
    private Integer qtCurtidas = 0;

    @Column(name = "qt_denuncias", nullable = false)
    private Integer qtDenuncias = 0;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    public Comentario() {
    }

    public Comentario(Post post, Usuario usuario, String texto) {
        this.post = post;
        this.usuario = usuario;
        this.texto = texto;
        this.qtCurtidas = 0;
        this.qtDenuncias = 0;
    }

    @PrePersist
    public void prePersist() {
        if (this.dataCriacao == null) {
            this.dataCriacao = LocalDateTime.now();
        }
        if (this.qtCurtidas == null) {
            this.qtCurtidas = 0;
        }
        if (this.qtDenuncias == null) {
            this.qtDenuncias = 0;
        }
    }

    public void incrementarCurtidas() {
        this.qtCurtidas = (this.qtCurtidas == null ? 0 : this.qtCurtidas) + 1;
    }

    public void decrementarCurtidas() {
        if (this.qtCurtidas != null && this.qtCurtidas > 0) {
            this.qtCurtidas--;
        }
    }

    public void incrementarDenuncias() {
        this.qtDenuncias = (this.qtDenuncias == null ? 0 : this.qtDenuncias) + 1;
    }

    public void zerarDenuncias() {
        this.qtDenuncias = 0;
    }

    public void atualizarTexto(String novoTexto) {
        if (novoTexto != null && !novoTexto.isBlank()) {
            this.texto = novoTexto;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public Integer getQtCurtidas() {
        return qtCurtidas;
    }

    public void setQtCurtidas(Integer qtCurtidas) {
        this.qtCurtidas = qtCurtidas;
    }

    public Integer getQtDenuncias() {
        return qtDenuncias;
    }

    public void setQtDenuncias(Integer qtDenuncias) {
        this.qtDenuncias = qtDenuncias;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}

