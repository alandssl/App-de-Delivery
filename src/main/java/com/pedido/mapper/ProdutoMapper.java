package com.pedido.mapper;

import com.pedido.dto.ProdutoRequestDTO;
import com.pedido.dto.ProdutoResponseDTO;
import com.pedido.model.Produto;

public class ProdutoMapper {

    public static ProdutoResponseDTO toResponseDTO(Produto produto){
        ProdutoResponseDTO dto = new ProdutoResponseDTO();
        dto.setId(produto.getId());
        dto.setNome(produto.getNome());
        dto.setDescricao(produto.getDescricao());
        dto.setPreco(produto.getPreco());
        return dto;
    }

    public static Produto toEntity(ProdutoRequestDTO dto){
        Produto produto = new Produto();
        produto.setId(dto.getId());
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        return produto;
    }

}
