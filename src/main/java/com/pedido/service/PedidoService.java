package com.pedido.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.pedido.dto.PedidoRequestDTO;
import com.pedido.dto.PedidoResponseDTO;
import com.pedido.enums.StatusPedido;
import com.pedido.mapper.PedidoItemMapper;
import com.pedido.mapper.PedidoMapper;
import com.pedido.model.Pagamento;
import com.pedido.model.Pedido;
import com.pedido.model.PedidoItem;
import com.pedido.repository.PedidoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository repository;

    public PedidoResponseDTO salvar(PedidoRequestDTO  dto){
        // Passar de DTO -> ENTITY
        Pedido pedido = PedidoMapper.toEntity(dto);

        Pagamento pagamento = new Pagamento();

        if(pedido.getStatusPedido() == StatusPedido.PEDIDO_ACEITO && pagamento.getPago() == true || 
        pedido.getStatusPedido() == StatusPedido.PEDIDO_ACEITO && pagamento.getMetodoPagamento() == "PAGAR NA ENTREGA"){
            pedido.setDataHora(LocalDateTime.now());
        }

        // SALVAR NO BANCO
        repository.save(pedido);
        // RETORNA PARA ENTITY -> DTO
        return PedidoMapper.toResponseDTO(pedido);
    }

    public PedidoResponseDTO atualizar(PedidoRequestDTO dto){
        Pedido pedido = repository.findById(dto.getId())
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        // Atualizar os campos do pedido com base no DTO
        // converte DTO -> Entity
        List<PedidoItem> itens = dto.getItems().stream()
            .map(PedidoItemMapper::toEntity)
            .collect(Collectors.toList());
        // seta no pedido
        pedido.setItens(itens);
        pedido.setValorTotal(itens.stream().mapToDouble(i -> i.getValorUnitario() * i.getQuantidade()).sum());
        // SALVAR NO BANCO
        repository.save(pedido);
        // RETORNA PARA ENTITY -> DTO
        return PedidoMapper.toResponseDTO(pedido);
    }

    public PedidoResponseDTO cancelar(Long id){
        Pedido pedido = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setStatusPedido(StatusPedido.CANCELADO);
        pedido.setDataHora(LocalDateTime.now());
        repository.save(pedido);
        return PedidoMapper.toResponseDTO(pedido);
    }

    public PedidoResponseDTO excluir(Long id) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setExcludedAt(LocalDateTime.now());
        repository.save(pedido);
        return PedidoMapper.toResponseDTO(pedido);
        }

}
