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

import com.pedido.model.Produto;
import com.pedido.model.Usuario;
import com.pedido.repository.ProdutoRepository;
import com.pedido.repository.UsuarioRepository;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class PedidoService {

    private final PedidoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoResponseDTO salvar(PedidoRequestDTO dto) {
        Pedido pedido = PedidoMapper.toEntity(dto);

        if (dto.getClienteId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            pedido.setUsuarioId(usuario);
        }

        pedido.setDataHora(LocalDateTime.now());

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            List<PedidoItem> itens = dto.getItems().stream().map(itemDto -> {
                PedidoItem item = new PedidoItem();
                Produto produto = produtoRepository.findById(itemDto.getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
                item.setProdutoId(produto);
                item.setQuantidade(itemDto.getQuantidade());
                item.setValorUnitario(produto.getPreco());
                item.setPedido(pedido);
                return item;
            }).collect(Collectors.toList());
            
            pedido.setItens(itens);
            pedido.setValorTotal(itens.stream().mapToDouble(i -> i.getValorUnitario() * i.getQuantidade()).sum());
        } else {
            pedido.setValorTotal(0.0);
        }

        repository.save(pedido);
        return PedidoMapper.toResponseDTO(pedido);
    }

    public PedidoResponseDTO atualizar(PedidoRequestDTO dto) {
        Pedido pedido = repository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        // Atualizar os campos do pedido com base no DTO
        // converte DTO -> Entity
        List<PedidoItem> itens = dto.getItems().stream()
                .map(PedidoItemMapper::toEntity)
                .collect(Collectors.toList());
        // seta no pedido
        itens.forEach(item -> item.setPedido(pedido));

        pedido.setItens(itens);
        pedido.setValorTotal(itens.stream().mapToDouble(i -> i.getValorUnitario() * i.getQuantidade()).sum());
        // SALVAR NO BANCO
        repository.save(pedido);
        // RETORNA PARA ENTITY -> DTO
        return PedidoMapper.toResponseDTO(pedido);
    }

    public PedidoResponseDTO cancelar(Long id) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setStatusPedido(StatusPedido.CANCELADO);
        pedido.setDataHora(LocalDateTime.now());
        repository.save(pedido);
        return PedidoMapper.toResponseDTO(pedido);
    }

    public PedidoResponseDTO marcarComoAvaliado(Long id) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setAvaliado(true);
        Pedido savedPedido = repository.save(pedido);
        return PedidoMapper.toResponseDTO(savedPedido);
    }

    public PedidoResponseDTO atualizarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setStatusPedido(novoStatus);
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

    public PedidoResponseDTO buscarPorId(Long id) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        return PedidoMapper.toResponseDTO(pedido);
    }

    public List<PedidoResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(PedidoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

}
