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
@Table(name = "codigo_autenticacao")
public class CodigoAutenticacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 100)
    private String codigo;

    @Column(name = "canal_envio", nullable = false, length = 20)
    private String canalEnvio;

    @Column(nullable = false)
    private LocalDateTime expiracao;

    @Column(name = "tentativas_envio", nullable = false)
    private Integer tentativasEnvio = 0;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    public CodigoAutenticacao() {
    }

    public CodigoAutenticacao(Usuario usuario, String codigo, String canalEnvio, LocalDateTime expiracao) {
        this.usuario = usuario;
        this.codigo = codigo;
        this.canalEnvio = canalEnvio;
        this.expiracao = expiracao;
        this.tentativasEnvio = 0;
    }

    @PrePersist
    public void prePersist() {
        if (this.dataCriacao == null) {
            this.dataCriacao = LocalDateTime.now();
        }
        if (this.tentativasEnvio == null) {
            this.tentativasEnvio = 0;
        }
    }

    public boolean isExpirado() {
        return LocalDateTime.now().isAfter(this.expiracao);
    }

    public void incrementarTentativas() {
        this.tentativasEnvio = (this.tentativasEnvio == null ? 0 : this.tentativasEnvio) + 1;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getCanalEnvio() {
        return canalEnvio;
    }

    public void setCanalEnvio(String canalEnvio) {
        this.canalEnvio = canalEnvio;
    }

    public LocalDateTime getExpiracao() {
        return expiracao;
    }

    public void setExpiracao(LocalDateTime expiracao) {
        this.expiracao = expiracao;
    }

    public Integer getTentativasEnvio() {
        return tentativasEnvio;
    }

    public void setTentativasEnvio(Integer tentativasEnvio) {
        this.tentativasEnvio = tentativasEnvio;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}

