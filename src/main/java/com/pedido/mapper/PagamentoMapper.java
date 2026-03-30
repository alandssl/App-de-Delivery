package com.pedido.mapper;

import com.pedido.dto.PagamentoRequestDTO;
import com.pedido.dto.PagamentoResponseDTO;
import com.pedido.model.Usuario;
import com.pedido.model.Pagamento;
import com.pedido.model.Pedido;

public class PagamentoMapper {

    public static PagamentoResponseDTO toResponseDTO(Pagamento pagamento){
        PagamentoResponseDTO dto = new PagamentoResponseDTO();
        dto.setId(pagamento.getId());
        dto.setMetodoPagamento(pagamento.getMetodoPagamento());
        dto.setPago(pagamento.getPago());
        dto.setUsuarioId(pagamento.getUsuarioId().getId());

        if(pagamento.getPedidoId() != null) {
            dto.setPedidoId(pagamento.getPedidoId().getId());
        }
        
        if(pagamento.getUsuarioId() != null){
            dto.setUsuarioId(pagamento.getUsuarioId().getId());
        }
        
        return dto;

    }   

    public static Pagamento toEntity(PagamentoRequestDTO dto, Pedido pedido, Usuario usuario){
        Pagamento pagamento = new Pagamento();
        pagamento.setMetodoPagamento(dto.getMetodoPagamento());
        pagamento.setPedidoId(pedido);
        pagamento.setUsuarioId(usuario);

        return pagamento;
    }
}
