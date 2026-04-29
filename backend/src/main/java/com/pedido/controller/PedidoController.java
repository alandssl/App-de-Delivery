package com.pedido.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

import com.pedido.dto.PedidoRequestDTO;
import com.pedido.dto.PedidoResponseDTO;
import com.pedido.service.PedidoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PedidoController {

    private final PedidoService service;

    // LISTAR TODOS OS PEDIDOS
    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> listarTodos() {
        List<PedidoResponseDTO> pedidos = service.listarTodos();
        return ResponseEntity.ok(pedidos);
    }

    // CRIAR PEDIDO
    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criar(@RequestBody PedidoRequestDTO dto) {
        PedidoResponseDTO pedido = service.salvar(dto);
        return ResponseEntity.ok(pedido);
    }

    // ATUALIZAR PEDIDO
    @PutMapping
    public ResponseEntity<PedidoResponseDTO> atualizar(@RequestBody PedidoRequestDTO dto) {
        PedidoResponseDTO pedido = service.atualizar(dto);
        return ResponseEntity.ok(pedido);
    }

    // CANCELAR PEDIDO
    @PatchMapping("/cancelar/{id}")
    public ResponseEntity<PedidoResponseDTO> cancelar(@PathVariable Long id) {
        PedidoResponseDTO pedido = service.cancelar(id);
        return ResponseEntity.ok(pedido);
    }

    // ATUALIZAR STATUS
    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoResponseDTO> atualizarStatus(@PathVariable Long id, @RequestBody com.pedido.enums.StatusPedido status) {
        PedidoResponseDTO pedido = service.atualizarStatus(id, status);
        return ResponseEntity.ok(pedido);
    }

    // MARCAR COMO AVALIADO
    @PatchMapping("/{id}/avaliar")
    public ResponseEntity<PedidoResponseDTO> marcarComoAvaliado(@PathVariable Long id) {
        PedidoResponseDTO pedido = service.marcarComoAvaliado(id);
        return ResponseEntity.ok(pedido);
    }

    // EXCLUIR (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> excluir(@PathVariable Long id) {
        PedidoResponseDTO pedido = service.excluir(id);
        return ResponseEntity.ok(pedido);
    }
}