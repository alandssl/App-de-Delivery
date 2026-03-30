package com.pedido.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pedido_itens")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PedidoItem {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="id_pedido")
    private Pedido pedidoId;

    @ManyToOne
    @JoinColumn(name="id_produto")
    private Produto produtoId;

    private Integer quantidade;

    private Double valorUnitario;

    private String observacao;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // Data e hora em que o pagamento foi criado

    @Column(name = "excluded_at")
    private LocalDateTime excludedAt; // Data e hora em que o pagamento foi excluído

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

}
