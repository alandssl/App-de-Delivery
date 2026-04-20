package com.pedido.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedido.model.Endereco;
import com.pedido.service.EnderecoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/enderecos")
@RequiredArgsConstructor
public class EnderecoController {

    private final EnderecoService service;

    // CRIAR
    @PostMapping
    public ResponseEntity<Endereco> criar(@RequestBody Endereco endereco) {
        Endereco novoEndereco = service.criar(endereco);
        return ResponseEntity.ok(novoEndereco);
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Endereco> buscarPorId(@PathVariable Long id) {
        Endereco endereco = service.buscarPorId(id);
        return ResponseEntity.ok(endereco);
    }

    // ATUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<Endereco> atualizar(@PathVariable Long id, @RequestBody Endereco endereco) {
        Endereco enderecoAtualizado = service.atualizar(id, endereco);
        return ResponseEntity.ok(enderecoAtualizado);
    }

    // DELETAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // LISTAR TODOS
    @GetMapping
    public ResponseEntity<List<Endereco>> listarTodos() {
        List<Endereco> lista = service.ListarTodos();
        return ResponseEntity.ok(lista);
    }

    // LISTAR POR CLIENTE ID
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Endereco>> listarPorCliente(@PathVariable Long clienteId) {
        List<Endereco> lista = service.ListarPorClienteId(clienteId);
        return ResponseEntity.ok(lista);
    }
}