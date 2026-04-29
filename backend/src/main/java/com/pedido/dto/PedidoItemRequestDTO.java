package com.pedido.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PedidoItemRequestDTO {

    private Long id;
    private Long idProduto;
    private Integer quantidade;
    private Double valorUnitario;

}
