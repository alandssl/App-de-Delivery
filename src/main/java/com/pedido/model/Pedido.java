package com.pedido.model;

import java.time.LocalDate;

import com.pedido.enums.StatusPedido;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pedidos")
@AllArgsConstructor
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDate dataHora;

    @Enumerated(EnumType.STRING)
    @Column
    private StatusPedido statusPedido;

    @Column
    private Double valorTotal;

    @Column
    private Long clienteId;

    @ManyToOne
    @JoinColumn(name="id_produto");
    private Produto produto;


}
