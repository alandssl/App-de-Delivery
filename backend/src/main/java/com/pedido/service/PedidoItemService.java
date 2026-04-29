package com.pedido.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.pedido.dto.PedidoItemRequestDTO;
import com.pedido.dto.PedidoItemResponseDTO;
import com.pedido.mapper.PedidoItemMapper;
import com.pedido.model.PedidoItem;
import com.pedido.model.Usuario;
import com.pedido.repository.PedidoItemRepository;
import com.pedido.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoItemService {

    private final PedidoItemRepository repository;
    private final UsuarioRepository usuarioRepository;

    public PedidoItem salvar(PedidoItem item) {
        return repository.save(item);
    }

    public PedidoItemResponseDTO atualizar(PedidoItemRequestDTO dto, Long usuarioId) {
        PedidoItem itemExistente = repository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("PedidoItem não encontrado"));

        itemExistente.setQuantidade(dto.getQuantidade());

        Usuario usuarioLogado = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (Boolean.TRUE.equals(usuarioLogado.getIsAdmin())) {
            itemExistente.setValorUnitario(dto.getValorUnitario());
        }
        return PedidoItemMapper.toResponseDTO(repository.save(itemExistente));
    }

    public PedidoItemResponseDTO excluir(Long id) {
        PedidoItem itemExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("PedidoItem não encontrado"));
        itemExistente.setExcludedAt(LocalDateTime.now());
        repository.save(itemExistente);
        return PedidoItemMapper.toResponseDTO(itemExistente);
    }

    public PedidoItemResponseDTO buscarPorId(Long id) {
        PedidoItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("PedidoItem não encontrado"));
        return PedidoItemMapper.toResponseDTO(item);

    }

}
