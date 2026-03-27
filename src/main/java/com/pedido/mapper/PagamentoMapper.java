package com.pedido.mapper;

import com.pedido.dto.PagamentoRequestDTO;
import com.pedido.dto.PagamentoResponseDTO;
import com.pedido.model.Cliente;
import com.pedido.model.Pagamento;
import com.pedido.model.Pedido;

public class PagamentoMapper {

    public static PagamentoResponseDTO toResponseDTO(Pagamento pagamento){
        PagamentoResponseDTO dto = new PagamentoResponseDTO();
        dto.setId(pagamento.getId());
        dto.setMetodoPagamento(pagamento.getMetodoPagamento());
        dto.setPago(pagamento.getPago());
        dto.setClienteId(pagamento.getClienteId().getId());

        if(pagamento.getPedidoId() != null) {
            dto.setPedidoId(pagamento.getPedidoId().getId());
        }
        
        if(pagamento.getClienteId() != null){
            dto.setClienteId(pagamento.getClienteId().getId());
        }
        
        return dto;

    }   

    public static Pagamento toEntity(PagamentoRequestDTO dto, Pedido pedido, Cliente cliente){
        Pagamento pagamento = new Pagamento();
        pagamento.setMetodoPagamento(dto.getMetodoPagamento());
        pagamento.setPedidoId(pedido);
        pagamento.setClienteId(cliente);

        return pagamento;
    }
}
