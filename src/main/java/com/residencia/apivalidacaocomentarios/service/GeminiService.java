package com.residencia.apivalidacaocomentarios.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final RestTemplate restTemplate;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.url}")
    private String geminiBaseUrl;

    public GeminiService(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public boolean avaliarComentario(String comentario) {
        String geminiUrl = geminiBaseUrl+ "?key=" + geminiApiKey;

        String prompt = "Esse comentário é ofensivo? Responda apenas com 'sim' ou 'não': " + comentario;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            String url = geminiBaseUrl + "?key=" + geminiApiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
            String output = parts.get(0).get("text");

            return output.toLowerCase().contains("não"); // se não for ofensivo, aprova
        } catch (Exception e) {
            e.printStackTrace(); // <-- MUITO importante para ver no console o que quebrou
            return false;
        }
    }


}

