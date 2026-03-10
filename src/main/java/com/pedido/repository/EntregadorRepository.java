package com.pedido.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pedido.model.Entregador;

@Repository
public interface EntregadorRepository extends JpaRepository<Entregador, Long> {

}
