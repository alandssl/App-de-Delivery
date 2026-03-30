package com.pedido.model;

import java.time.LocalDateTime;
import java.util.List;

import com.pedido.enums.StatusPedido;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pedidos")
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column
    private StatusPedido statusPedido;

    @Column
    private Double valorTotal;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuarioId;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<PedidoItem> itens;

    @ManyToOne
    @JoinColumn(name = "id_entregador")
    private Entregador entregadorId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // Data e hora em que o pagamento foi criado

    @Column(name = "excluded_at")
    private LocalDateTime excludedAt; // Data e hora em que o pagamento foi excluído

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

}
