package com.pedido.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedido.model.Pagamento;
import com.pedido.repository.PagamentoRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository repository;

    public List<Pagamento> mostrarPagamentosCliente(Long clienteId){
        List<Pagamento> clientes = repository.findByClienteId_Id(clienteId);
        return clientes;
    }

    public Pagamento salvarPagamento(Pagamento pagamento){
        return repository.save(pagamento);
    }

}
