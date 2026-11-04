package com.colalimpa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(unique = true, length = 150)
    private String email;

    @Column(unique = true, length = 20)
    private String telefone;

    @Column(name = "foto_url", columnDefinition = "TEXT")
    private String fotoUrl;

    @Column(nullable = false)
    private Integer xp = 0;

    @Column(name = "meta_diaria_minutos")
    private Integer metaDiariaMinutos;

    @Column(name = "is_admin", nullable = false)
    private Boolean isAdmin = false;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    public Usuario() {
    }

    public Usuario(String nome, String email, String telefone, String fotoUrl, Integer metaDiariaMinutos) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.fotoUrl = fotoUrl;
        this.metaDiariaMinutos = metaDiariaMinutos;
        this.xp = 0;
        this.isAdmin = false;
    }

    @PrePersist
    public void prePersist() {
        if (this.dataCriacao == null) {
            this.dataCriacao = LocalDateTime.now();
        }
        if (this.xp == null) {
            this.xp = 0;
        }
        if (this.isAdmin == null) {
            this.isAdmin = false;
        }
    }

    public void adicionarXp(int pontos) {
        if (pontos > 0) {
            this.xp = (this.xp == null ? 0 : this.xp) + pontos;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public Integer getXp() {
        return xp;
    }

    public void setXp(Integer xp) {
        this.xp = xp;
    }

    public Integer getMetaDiariaMinutos() {
        return metaDiariaMinutos;
    }

    public void setMetaDiariaMinutos(Integer metaDiariaMinutos) {
        this.metaDiariaMinutos = metaDiariaMinutos;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}

