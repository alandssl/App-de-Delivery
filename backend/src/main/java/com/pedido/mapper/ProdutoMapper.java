package com.pedido.mapper;

import com.pedido.dto.ProdutoRequestDTO;
import com.pedido.dto.ProdutoResponseDTO;
import com.pedido.model.Produto;
import com.pedido.enums.CategoriaLanches;

public class ProdutoMapper {

    public static ProdutoResponseDTO toResponseDTO(Produto produto) {
        ProdutoResponseDTO dto = new ProdutoResponseDTO();
        dto.setId(produto.getId());
        dto.setNome(produto.getNome());
        dto.setDescricao(produto.getDescricao());
        dto.setPreco(produto.getPreco());
        dto.setImagemUrl(produto.getImagemUrl());
        dto.setRestaurante(produto.getRestaurante());
        dto.setTempo_preparo(produto.getTempo_preparo());
        dto.setAvaliacao(produto.getAvaliacao());
        dto.setQuantidadeAvaliacoes(produto.getQtdAvaliacoes());
        dto.setCategoriaLanches(produto.getCategoriaLanches());
        return dto;
    }

    public static Produto toEntity(ProdutoRequestDTO dto) {
        Produto produto = new Produto();
        produto.setId(dto.getId());
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setImagemUrl(dto.getImagemUrl());
        produto.setRestaurante(dto.getRestaurante());
        produto.setTempo_preparo(dto.getTempo_preparo());
        produto.setAvaliacao(dto.getAvaliacao());
        produto.setQtdAvaliacoes(dto.getQuantidadeAvaliacoes());
        produto.setCategoriaLanches(dto.getCategoriaLanches());
        return produto;
    }

}
