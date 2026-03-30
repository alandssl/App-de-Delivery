package com.pedido.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
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
    private Pedido pedidoId; // Associação com o pedido correspondente

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuarioId; // Associação com o cliente que realizou o pagamento

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // Data e hora em que o pagamento foi criado

    @Column(name = "excluded_at")
    private LocalDateTime excludedAt; // Data e hora em que o pagamento foi excluído

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
