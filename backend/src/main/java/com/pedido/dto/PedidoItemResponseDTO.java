package com.pedido.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PedidoItemResponseDTO {

    private Long id;
    private String nomeProduto;
    private Integer quantidade;
    private Double valorUnitario;
    private Long produtoId;

}
