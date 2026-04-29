package com.pedido.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedido.model.Endereco;
import com.pedido.repository.EnderecoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository repository;

    public Endereco criar(Endereco endereco) {
        return repository.save(endereco);
    }

    public Endereco buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
    }

    public Endereco atualizar(Long id, Endereco endereco) {
        Endereco enderecoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        enderecoExistente.setRua(endereco.getRua());
        enderecoExistente.setNumero(endereco.getNumero());
        enderecoExistente.setBairro(endereco.getBairro());
        enderecoExistente.setCidade(endereco.getCidade());
        enderecoExistente.setCep(endereco.getCep());

        Endereco enderecoAtualizado = repository.save(enderecoExistente);
        return enderecoAtualizado;
    }

    public void deletar(Long id) {
        Endereco endereco = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        repository.delete(endereco);
    }

    public List<Endereco> ListarTodos() {
        return repository.findAll();
    }

    public List<Endereco> ListarPorClienteId(Long clienteId) {
        return repository.findByUsuario_Id(clienteId);
    }

    public Endereco buscarPorIdEClienteId(Long id, Long clienteId) {
        return repository.findByIdAndUsuario_Id(id, clienteId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado para o cliente especificado"));
    }

    public Endereco definirPrincipal(Long id, Long usuarioId) {
        List<Endereco> enderecos = repository.findByUsuario_Id(usuarioId);
        Endereco principal = null;

        for (Endereco e : enderecos) {
            if (e.getId().equals(id)) {
                e.setIsPrincipal(true);
                principal = e;
            } else {
                e.setIsPrincipal(false);
            }
        }
        repository.saveAll(enderecos);
        return principal;
    }
}
