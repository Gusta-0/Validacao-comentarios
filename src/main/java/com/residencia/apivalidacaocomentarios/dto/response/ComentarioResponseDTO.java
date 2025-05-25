package com.residencia.apivalidacaocomentarios.dto.response;

import java.time.LocalDateTime;

public record ComentarioResponseDTO(Long id,
                                    String nomeUsuario,
                                    String comentario,
                                    boolean aprovado,
                                    LocalDateTime criadoEm) {
}
