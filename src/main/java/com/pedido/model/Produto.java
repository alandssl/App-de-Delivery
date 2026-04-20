package com.pedido.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "produtos")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Produto {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nome;

    @Column
    private String descricao;

    @Column
    private String restaurante;

    @Column(name = "tempo_preparo")
    private String tempo_preparo;

    @Column(name = "imagem_url")
    private String imagemUrl;

    @Column
    private Double preco;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // Data e hora em que o pagamento foi criado

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // Data e hora em que o pagamento foi atualizado

    @Column(name = "excluded_at")
    private LocalDateTime excludedAt; // Data e hora em que o pagamento foi excluído

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
