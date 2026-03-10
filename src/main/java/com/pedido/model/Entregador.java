package com.pedido.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.GeneratedValue;


@Entity
@Table(name = "entregadores")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Entregador { //entregadores do aplicativo que podem entregar o pedido, 
// cada pedido tem um entregador associado

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String telefone;
    private String veiculo;
}
