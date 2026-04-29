package com.pedido.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pedido.model.Endereco;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    List<Endereco> findByUsuario_Id(Long usuarioId);

    public Optional<Endereco> findByIdAndUsuario_Id(Long id, Long usuarioId);
}
