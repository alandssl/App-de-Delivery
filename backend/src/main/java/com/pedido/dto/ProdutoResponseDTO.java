package com.pedido.dto;

import com.pedido.enums.CategoriaLanches;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoResponseDTO {

    private Long id;
    private String nome;
    private String descricao;
    private Double preco;
    private String restaurante;
    private String tempo_preparo;
    private String imagemUrl;
    private Double avaliacao;
    private Integer quantidadeAvaliacoes;
    private CategoriaLanches categoriaLanches;
}
