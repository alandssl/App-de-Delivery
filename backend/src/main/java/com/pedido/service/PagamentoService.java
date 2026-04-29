package com.pedido.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pedido.dto.PagamentoRequestDTO;
import com.pedido.dto.PagamentoResponseDTO;
import com.pedido.mapper.PagamentoMapper;
import com.pedido.model.Pagamento;
import com.pedido.model.Pedido;
import com.pedido.model.Usuario;
import com.pedido.repository.PagamentoRepository;
import com.pedido.repository.PedidoRepository;
import com.pedido.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository repository;
    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<PagamentoResponseDTO> mostrarPagamentosCliente(Long usuarioId) {
        List<Pagamento> pagamentos = repository.findByUsuarioId_Id(usuarioId);
        return pagamentos.stream()
                .map(PagamentoMapper::toResponseDTO)
                .toList();

    }

    public PagamentoResponseDTO salvarPagamento(PagamentoRequestDTO dto) {
        Pedido pedido = pedidoRepository.findById(dto.getPedidoId())
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Passar de DTO -> ENTITY
        Pagamento pagamento = PagamentoMapper.toEntity(dto, pedido, usuario);

        // SALVAR NO BANCO
        Pagamento pagamentoSalvo = repository.save(pagamento);

        // REOTRNA PARA ENTITY -> DTO
        return PagamentoMapper.toResponseDTO(pagamentoSalvo);
    }

    public void excluirPagamento(Long id) {
        Pagamento pagamento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        pagamento.setExcludedAt(LocalDateTime.now());
        repository.save(pagamento);

    }

    public PagamentoResponseDTO buscarPagamentoPorId(Long id) {
        Pagamento pagamento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        return PagamentoMapper.toResponseDTO(pagamento);
    }

}
