package com.residencia.apivalidacaocomentarios.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "O nome do usuário não pode estar em branco")
    @Size(min = 3, max = 100, message = "O nome do usuário deve ter entre {min} e {max} caracteres")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]+$", message = "O nome do usuário deve conter apenas letras e espaços")
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

    public Usuario(Long id, String nomeUsuario) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
    }

    public Usuario(Long id, String nomeUsuario, List<Comentario> comentarios) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
        this.comentarios = comentarios;
    }
}

