package com.residencia.apivalidacaocomentarios.exception;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public class ErrorResponse {
    private int status;
    private String erro;
    private String mensagem;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    private LocalDateTime timestamp;
    private String path; // Opcional: para mostrar o caminho da requisição que gerou o erro

    public ErrorResponse(int status, String erro, String mensagem) {
        this.status = status;
        this.erro = erro;
        this.mensagem = mensagem;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(int status, String erro, String mensagem, String path) {
        this.status = status;
        this.erro = erro;
        this.mensagem = mensagem;
        this.timestamp = LocalDateTime.now();
        this.path = path;
    }

    // Getters
    public int getStatus() {
        return status;
    }

    public String getErro() {
        return erro;
    }

    public String getMensagem() {
        return mensagem;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getPath() {
        return path;
    }

    // Você pode adicionar setters se precisar, mas para uma resposta de erro, geralmente não é necessário.
}
