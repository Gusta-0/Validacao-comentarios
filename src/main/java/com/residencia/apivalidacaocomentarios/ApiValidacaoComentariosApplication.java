package com.residencia.apivalidacaocomentarios;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
@OpenAPIDefinition(
        info = @io.swagger.v3.oas.annotations.info.Info(title = "Api validação de comentários", version = "1.0", description = "API avalia comnentários com a IA Gemini")
)
public class ApiValidacaoComentariosApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiValidacaoComentariosApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
