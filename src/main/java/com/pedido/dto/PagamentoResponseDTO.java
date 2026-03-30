package com.pedido.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagamentoResponseDTO {

    private Long id;
    private String metodoPagamento;
    private boolean pago;
    private Long pedidoId;
    private Long usuarioId;
}
