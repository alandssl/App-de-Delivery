package com.pedido.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedido.dto.PagamentoRequestDTO;
import com.pedido.dto.PagamentoResponseDTO;
import com.pedido.mapper.PagamentoMapper;
import com.pedido.model.Pagamento;
import com.pedido.model.Pedido;
import com.pedido.repository.PagamentoRepository;
import com.pedido.repository.PedidoRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository repository;
    private final PedidoRepository pedidoRepository;

    public List<PagamentoResponseDTO> mostrarPagamentosCliente(Long clienteId){
        List<Pagamento> pagamentos = repository.findByClienteId_Id(clienteId);
        return pagamentos.stream()
            .map(PagamentoMapper::toResponseDTO)
            .toList();
        
    }

    public PagamentoResponseDTO salvarPagamento(PagamentoRequestDTO dto){
        Pedido pedido = pedidoRepository.findById(dto.getPedidoId())
        .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Passar de DTO -> ENTITY
        Pagamento pagamento = PagamentoMapper.toEntity(dto, pedido);

        // SALVAR NO BANCO
        Pagamento pagamentoSalvo = repository.save(pagamento);

        // REOTRNA PARA ENTITY -> DTO
        return PagamentoMapper.toResponseDTO(pagamentoSalvo);
    }


    

}
