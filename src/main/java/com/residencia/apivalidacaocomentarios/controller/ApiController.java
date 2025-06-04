package com.residencia.apivalidacaocomentarios.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    @GetMapping("/private")
    public String areaProtegida() {
        return "Acesso autorizado à área privada!";
    }
}
