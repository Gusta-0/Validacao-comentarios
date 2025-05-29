package com.residencia.apivalidacaocomentarios.controller;



import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public String publicAccess() {
        return "Conteúdo público.";
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()") // Exige autenticação
    public String userAccess() {
        return "Conteúdo para usuário autenticado.";
    }


    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Conteúdo para admin.";
    }
}
