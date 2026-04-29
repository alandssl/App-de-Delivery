package com.pedido.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedido.model.Usuario;
import com.pedido.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;

    public Usuario criar(Usuario usuario) {
        return repository.save(usuario);
    }

    public Usuario atualizar(Long id, Usuario usuario) {
        Usuario usuarioExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));

        usuarioExistente.setName(usuario.getName());
        usuarioExistente.setTelefone(usuario.getTelefone());
        usuarioExistente.setEmail(usuario.getEmail());

        Usuario usuarioAtualizado = repository.save(usuarioExistente);
        return usuarioAtualizado;
    }

    public void deletar(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));

        repository.delete(usuario);
    }

    public List<Usuario> ListarTodos() {
        return repository.findAll();
    }

    public Usuario findByEmail(String email) {
        return repository.findByEmail(email);
    }

}
