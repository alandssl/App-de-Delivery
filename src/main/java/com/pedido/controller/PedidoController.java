package com.pedido.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedido.dto.PedidoRequestDTO;
import com.pedido.dto.PedidoResponseDTO;
import com.pedido.service.PedidoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService service;

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

    // EXCLUIR (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> excluir(@PathVariable Long id) {
        PedidoResponseDTO pedido = service.excluir(id);
        return ResponseEntity.ok(pedido);
    }
}