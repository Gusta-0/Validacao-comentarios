package com.residencia.apivalidacaocomentarios.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    @GetMapping("/")
    public String home() {
        return "Bem-vindo à sua API simples!";
    }

    @GetMapping("/public")
    public String publicEndpoint() {
        return "Este é um endpoint público, acessível sem autenticação.";
    }

    @GetMapping("/private")
    public String privateEndpoint() {
        return "Este é um endpoint privado, acessível apenas com autenticação Basic.";
    }

    @GetMapping("/admin")
    public String adminEndpoint() {
        return "Este é um endpoint de ADMIN (você só verá isso se tiver a role ADMIN).";
    }
}
