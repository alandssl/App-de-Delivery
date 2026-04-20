package com.pedido.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedido.dto.PagamentoRequestDTO;
import com.pedido.dto.PagamentoResponseDTO;
import com.pedido.service.PagamentoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pagamento")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PagamentoController {

    private final PagamentoService service;

    @GetMapping
    public void mostrarPagamentosCliente(Long usuarioId) {
        service.mostrarPagamentosCliente(usuarioId);
    }

    @PostMapping("/salvar")
    public ResponseEntity<PagamentoResponseDTO> salvarPagamento(@RequestBody PagamentoRequestDTO dto) {
        PagamentoResponseDTO responseDTO = service.salvarPagamento(dto);
        return ResponseEntity.ok(responseDTO);
    }


    @PutMapping("/excluir")
    public void ExcluirPagamento(Long id) {
        service.excluirPagamento(id);
    }
    




}
