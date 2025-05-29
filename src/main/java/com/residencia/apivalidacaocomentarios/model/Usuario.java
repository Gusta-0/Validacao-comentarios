package com.residencia.apivalidacaocomentarios.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O nome do usuário não pode ser nulo")
    @Column(name = "nome_usuario", nullable = false)
    private String nomeUsuario;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comentario> comentarios = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_roles", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();



    public Usuario() {
    }

    // Construtor com dois parâmetros que falta
    public Usuario(Long id, String nomeUsuario) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
    }

    // Construtor com três parâmetros (já existe)
    public Usuario(Long id, String nomeUsuario, List<Comentario> comentarios) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
        this.comentarios = comentarios;
    }
}

