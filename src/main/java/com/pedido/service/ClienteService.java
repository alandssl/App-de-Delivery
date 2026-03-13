package com.pedido.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.pedido.model.Cliente;
import com.pedido.repository.ClienteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;

    public Cliente criar(Cliente cliente) {
        return repository.save(cliente);

    }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public Cliente atualizar(Long id, Cliente cliente) {
        Cliente clienteExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        clienteExistente.setName(cliente.getName());
        clienteExistente.setTelefone(cliente.getTelefone());
        cliente.setEmail(cliente.getEmail());

        Cliente clienteAtualizado = repository.save(cliente);
        return clienteAtualizado;
    }

    public void deletar(Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        repository.delete(cliente);
    }

    public List<Cliente> ListarTodos() {
        return repository.findAll();
    }

}
