package com.pedido.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.pedido.dto.PedidoItemResponseDTO;
import com.pedido.dto.PedidoRequestDTO;
import com.pedido.dto.PedidoResponseDTO;
import com.pedido.enums.StatusPedido;
import com.pedido.model.Pedido;

public class PedidoMapper {

    public static PedidoResponseDTO toResponseDTO(Pedido pedido){
        PedidoResponseDTO dto = new PedidoResponseDTO();
        dto.setId(pedido.getId());
        dto.setDataHora(pedido.getDataHora());
        dto.setStatusPedido(pedido.getStatusPedido().name());
        dto.setValorTotal(pedido.getValorTotal());
        dto.setClienteId(pedido.getUsuarioId().getId());

        if(pedido.getItens() != null){
            List<PedidoItemResponseDTO> itemsDTO = pedido.getItens().stream()
                .map(PedidoItemMapper::toResponseDTO)
                .collect(Collectors.toList());
            dto.setItems(itemsDTO);
        }

        return dto;
    }

    public static Pedido toEntity(PedidoRequestDTO dto){
        Pedido pedido = new Pedido();
        pedido.setId(dto.getId());
        pedido.setStatusPedido(StatusPedido.CRIADO); // Novo pedido sempre inicia com status CRIADO
        // Cliente e itens são setados na camada de serviço
        return pedido;
    }

}
