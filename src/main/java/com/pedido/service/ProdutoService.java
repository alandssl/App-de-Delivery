package com.pedido.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pedido.dto.ProdutoRequestDTO;
import com.pedido.dto.ProdutoResponseDTO;
import com.pedido.mapper.ProdutoMapper;
import com.pedido.model.Produto;
import com.pedido.repository.ProdutoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;

    public Produto salvar(Produto produto) {
        return repository.save(produto);

    }

    public ProdutoResponseDTO atualizar(ProdutoRequestDTO dto) {
        Produto produtoExistente = repository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produtoExistente.setNome(dto.getNome());
        produtoExistente.setDescricao(dto.getDescricao());
        produtoExistente.setPreco(dto.getPreco());

        return ProdutoMapper.toResponseDTO(repository.save(produtoExistente));
    }

    public ProdutoResponseDTO excluir(Long id) {
        Produto produtoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        produtoExistente.setExcludedAt(LocalDateTime.now());
        return ProdutoMapper.toResponseDTO(repository.save(produtoExistente));
    }

    public ProdutoResponseDTO buscarPorId(Long id) {
    Produto produto = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    return ProdutoMapper.toResponseDTO(produto);
}

    public List<ProdutoResponseDTO> listarTodos() {
    return repository.findAll().stream()
        .map(ProdutoMapper::toResponseDTO)
        .toList();
}

}
