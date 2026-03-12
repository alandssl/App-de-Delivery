package com.pedido.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EntregadorResponseDTO {

    private Long id;
    private String nome;
    private String telefone;
    private String veiculo;

}
