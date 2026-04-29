package com.pedido.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PedidoResponseDTO {

    private Long id;
    private LocalDateTime dataHora;
    private String statusPedido;
    private Double valorTotal;
    private Long clienteId;
    private List<PedidoItemResponseDTO> items;
    private Boolean avaliado;

}
