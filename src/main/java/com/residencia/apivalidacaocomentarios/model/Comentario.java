package com.residencia.apivalidacaocomentarios.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Schema(example = "Bom dia amigos", requiredMode = Schema.RequiredMode.REQUIRED, description = "Conteúdo do comentário")
    @NotBlank
    private String comentario;

    private boolean aprovado;

    private LocalDateTime criadoEm;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }

}
