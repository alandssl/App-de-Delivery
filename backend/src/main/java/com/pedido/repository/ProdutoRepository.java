package com.pedido.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pedido.enums.CategoriaLanches;
import com.pedido.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    public List<Produto> findByRestaurante(String restaurante);

    public List<Produto> findByCategoriaLanches(CategoriaLanches categoriaLanches);

}
