package com.residencia.apivalidacaocomentarios.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class IAValidationService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean isComentarioAdequado(String conteudo) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", "Este comentário é ofensivo ou inapropriado? Responda apenas com 'sim' ou 'não'. Comentário: " + conteudo))
                ))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            String resposta = ((Map)((List)response.getBody().get("candidates")).get(0)).get("content").toString();

            return resposta.toLowerCase().contains("não"); // Se não for ofensivo, está aprovado
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
