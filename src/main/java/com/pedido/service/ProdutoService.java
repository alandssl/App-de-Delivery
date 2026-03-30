package com.pedido.service;

import org.springframework.stereotype.Service;

import com.pedido.repository.ProdutoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;

    

}
