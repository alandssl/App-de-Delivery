package com.pedido.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedido.dto.PedidoItemRequestDTO;
import com.pedido.dto.PedidoItemResponseDTO;
import com.pedido.model.PedidoItem;
import com.pedido.service.PedidoItemService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pedido-itens")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PedidoItemController {

    private final PedidoItemService service;

    // CRIAR
    @PostMapping
    public ResponseEntity<PedidoItem> criar(@RequestBody PedidoItem item) {
        PedidoItem novoItem = service.salvar(item);
        return ResponseEntity.ok(novoItem);
    }

    // ATUALIZAR
    @PutMapping("/{usuarioId}")
    public ResponseEntity<PedidoItemResponseDTO> atualizar(
            @RequestBody PedidoItemRequestDTO dto,
            @PathVariable Long usuarioId) {

        PedidoItemResponseDTO itemAtualizado = service.atualizar(dto, usuarioId);
        return ResponseEntity.ok(itemAtualizado);
    }

    // EXCLUIR (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<PedidoItemResponseDTO> excluir(@PathVariable Long id) {
        PedidoItemResponseDTO item = service.excluir(id);
        return ResponseEntity.ok(item);
    }
}