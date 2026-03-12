package com.pedido.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnderecoResponseDTO {

    private Long id;
    private String rua;
    private String numero;
    private String cidade;
    private String estado;
    private String cep;
    
}
