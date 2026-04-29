package com.pedido.mapper;

import com.pedido.dto.PedidoItemRequestDTO;
import com.pedido.dto.PedidoItemResponseDTO;
import com.pedido.model.PedidoItem;

public class PedidoItemMapper {

    public static PedidoItemResponseDTO toResponseDTO(PedidoItem item){
        PedidoItemResponseDTO dto = new PedidoItemResponseDTO();
        dto.setId(item.getId());
        dto.setProdutoId(item.getProdutoId().getId());
        dto.setNomeProduto(item.getProdutoId().getNome());
        dto.setQuantidade(item.getQuantidade());
        dto.setValorUnitario(item.getValorUnitario());
        return dto;
    }

    public static PedidoItem toEntity(PedidoItemRequestDTO dto){
        PedidoItem item = new PedidoItem();
        item.setId(dto.getId());
        // Aqui você precisaria buscar o Produto pelo ID e setar no item
        item.setQuantidade(dto.getQuantidade());
        item.setValorUnitario(dto.getValorUnitario());
        return item;
    }

}
