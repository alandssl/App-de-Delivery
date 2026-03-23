package com.pedido.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pagamentos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Pagamento {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name="metodo_pagamento")
    private String metodoPagamento;

    private Boolean pago; // Indica se o pagamento foi realizado ou não

    @OneToOne
    private Pedido pedido; // Associação com o pedido correspondente

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente; // Associação com o cliente que realizou o pagamento


}
