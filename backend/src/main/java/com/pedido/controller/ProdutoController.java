package com.pedido.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import com.pedido.dto.ProdutoRequestDTO;
import com.pedido.dto.ProdutoResponseDTO;
import com.pedido.enums.CategoriaLanches;
import com.pedido.model.Produto;
import com.pedido.service.ProdutoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProdutoController {

    private final ProdutoService service;

    // CRIAR
    @PostMapping
    public ResponseEntity<Produto> criar(@RequestBody Produto produto) {
        Produto novoProduto = service.salvar(produto);
        return ResponseEntity.ok(novoProduto);
    }

    // ATUALIZAR
    @PutMapping
    public ResponseEntity<ProdutoResponseDTO> atualizar(@RequestBody ProdutoRequestDTO dto) {
        ProdutoResponseDTO produtoAtualizado = service.atualizar(dto);
        return ResponseEntity.ok(produtoAtualizado);
    }

    // EXCLUIR (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> excluir(@PathVariable Long id) {
        ProdutoResponseDTO produto = service.excluir(id);
        return ResponseEntity.ok(produto);
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        ProdutoResponseDTO produto = service.buscarPorId(id);
        return ResponseEntity.ok(produto);
    }

    // LISTAR TODOS
    @GetMapping
    public ResponseEntity<java.util.List<ProdutoResponseDTO>> listarTodos() {
        java.util.List<ProdutoResponseDTO> produtos = service.listarTodos();
        return ResponseEntity.ok(produtos);
    }

    @PostMapping("/imagem/{id}")
    public ResponseEntity<ProdutoResponseDTO> salvarImagem(@PathVariable Long id,
            @RequestParam("imagem") MultipartFile imagem) {
        ProdutoResponseDTO produto = service.salvarImagem(id, imagem);
        return ResponseEntity.ok(produto);
    }

    @PutMapping("/avaliacao/{id}")
    public ResponseEntity<ProdutoResponseDTO> avaliarPedido(@PathVariable Long id, @RequestBody ProdutoRequestDTO dto) {
        ProdutoResponseDTO produto = service.atualizarAvaliacao(id, dto.getAvaliacao());
        return ResponseEntity.ok(produto);
    }

    @GetMapping("/categoria/{categoriaLanches}")
    public ResponseEntity<List<ProdutoResponseDTO>> listarPorCategoria(
            @PathVariable CategoriaLanches categoriaLanches) {
        List<ProdutoResponseDTO> produtos = service.listarPorCategoria(categoriaLanches);
        return ResponseEntity.ok(produtos);
    }

}