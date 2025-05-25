package com.residencia.apivalidacaocomentarios.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ComentarioRequestDTO(
        @NotBlank(message = "Digite seu nome")
        String nomeUsuario,

        @NotBlank(message = "Escreva algo antes de enviar!")
        String comentario)
{
}
