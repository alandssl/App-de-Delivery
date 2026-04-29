package com.pedido.service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pedido.dto.ProdutoRequestDTO;
import com.pedido.dto.ProdutoResponseDTO;
import com.pedido.mapper.ProdutoMapper;
import com.pedido.model.Produto;
import com.pedido.enums.CategoriaLanches;
import com.pedido.repository.ProdutoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;

    public Produto salvar(Produto produto) {
        return repository.save(produto);

    }

    public ProdutoResponseDTO atualizar(ProdutoRequestDTO dto) {
        Produto produtoExistente = repository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produtoExistente.setNome(dto.getNome());
        produtoExistente.setDescricao(dto.getDescricao());
        produtoExistente.setPreco(dto.getPreco());
        produtoExistente.setRestaurante(dto.getRestaurante());
        produtoExistente.setTempo_preparo(dto.getTempo_preparo());
        produtoExistente.setCategoriaLanches(dto.getCategoriaLanches());

        return ProdutoMapper.toResponseDTO(repository.save(produtoExistente));
    }

    public ProdutoResponseDTO excluir(Long id) {
        Produto produtoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        produtoExistente.setExcludedAt(LocalDateTime.now());
        return ProdutoMapper.toResponseDTO(repository.save(produtoExistente));
    }

    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = repository.findById(id)
                .filter(p -> p.getExcludedAt() == null)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        return ProdutoMapper.toResponseDTO(produto);
    }

    public List<ProdutoResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .filter(p -> p.getExcludedAt() == null)
                .map(ProdutoMapper::toResponseDTO)
                .toList();
    }

    public ProdutoResponseDTO atualizarAvaliacao(Long id, Double novaAvaliacao) {
        // Validação: Avaliação deve ser entre 1 e 5
        if (novaAvaliacao < 1.0 || novaAvaliacao > 5.0) {
            throw new RuntimeException("A avaliação deve ser entre 1 e 5");
        }

        Produto produtoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Double avaliacaoAtual = produtoExistente.getAvaliacao() != null ? produtoExistente.getAvaliacao() : 0.0;
        Integer totalAvaliacoes = produtoExistente.getQtdAvaliacoes() != null
                ? produtoExistente.getQtdAvaliacoes()
                : 0;

        Double novaMedia;
        if (totalAvaliacoes == 0) {
            novaMedia = novaAvaliacao;
        } else {
            // Fórmula correta da média ponderada: ((média atual * qtd atual) + nova nota) /
            // (qtd atual + 1)
            novaMedia = ((avaliacaoAtual * totalAvaliacoes) + novaAvaliacao) / (totalAvaliacoes + 1);
        }

        // Garante que o resultado fique entre 1 e 5
        novaMedia = Math.max(1.0, Math.min(5.0, novaMedia));

        produtoExistente.setAvaliacao(novaMedia);
        produtoExistente.setQtdAvaliacoes(totalAvaliacoes + 1);
        return ProdutoMapper.toResponseDTO(repository.save(produtoExistente));
    }

    public List<ProdutoResponseDTO> listarPorRestaurante(String restaurante) {
        return repository.findByRestaurante(restaurante).stream()
                .filter(p -> p.getExcludedAt() == null)
                .map(ProdutoMapper::toResponseDTO)
                .toList();
    }

    public ProdutoResponseDTO salvarImagem(Long id, MultipartFile imagem) {
        Produto produtoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        try {
            byte[] bytes = imagem.getBytes();
            String imagemBase64 = "data:" + imagem.getContentType() + ";base64,"
                    + Base64.getEncoder().encodeToString(bytes);
            produtoExistente.setImagemUrl(imagemBase64);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar imagem");
        }
        return ProdutoMapper.toResponseDTO(repository.save(produtoExistente));
    }

    public List<ProdutoResponseDTO> listarPorCategoria(CategoriaLanches categoriaLanches) {
        return repository.findByCategoriaLanches(categoriaLanches).stream()
                .filter(p -> p.getExcludedAt() == null)
                .map(ProdutoMapper::toResponseDTO)
                .toList();
    }

}
