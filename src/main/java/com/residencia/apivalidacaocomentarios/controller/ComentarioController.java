package com.residencia.apivalidacaocomentarios.controller;

import org.springframework.web.bind.annotation.RestController;
import com.residencia.apivalidacaocomentarios.dto.request.ComentarioRequestDTO;
import com.residencia.apivalidacaocomentarios.dto.response.ComentarioResponseDTO;
import com.residencia.apivalidacaocomentarios.service.ComentarioService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/comentarios")
@Tag(name = "Comentario", description = "Gerenciamento de comentários")
public class ComentarioController {

    private final ComentarioService comentarioService;

    public ComentarioController(ComentarioService comentarioService) {
        this.comentarioService = comentarioService;
    }


    @PostMapping(produces = "application/json; charset=UTF-8")
    public ResponseEntity<ComentarioResponseDTO> criarComentario(@RequestBody @Valid ComentarioRequestDTO dto) {
        ComentarioResponseDTO comentarioSalvo = comentarioService.salvarComentario(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(comentarioSalvo.id())
                .toUri();

        return ResponseEntity.created(location).body(comentarioSalvo);
    }

    @GetMapping
    public ResponseEntity<List<ComentarioResponseDTO>> listar() {
        return ResponseEntity.ok(comentarioService.listarComentarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComentarioResponseDTO> buscarPorId(@PathVariable Long id) {
        ComentarioResponseDTO comentario = comentarioService.buscarPorId(id);
        return ResponseEntity.ok(comentario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComentarioResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ComentarioRequestDTO dto) {
        ComentarioResponseDTO atualizado = comentarioService.atualizarComentario(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        comentarioService.deletarComentario(id);
        return ResponseEntity.noContent().build();
    }
}
