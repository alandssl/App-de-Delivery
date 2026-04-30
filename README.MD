# 🍔 Delivery App

Sistema de delivery completo com área do cliente e painel administrativo, desenvolvido com arquitetura cliente-servidor utilizando Java no backend e React (Vite) no frontend.

---

## 📖 Sobre o Projeto

A aplicação permite que clientes realizem pedidos de forma simples e intuitiva, enquanto administradores gerenciam produtos e acompanham pedidos em tempo real.

---

## 🧩 Estrutura do Projeto

delivery-app/

backend/ → API em Java  
frontend/ → Interface em React (Vite)  
README.md

---

## 👤 Funcionalidades

### Cliente

- Cadastro e login
- Adicionar/remover itens do carrinho
- Realizar pedidos
- Cadastrar endereço
- Definir endereço principal
- Visualizar pedidos

### Administrador

- Visualizar pedidos
- Atualizar status dos pedidos
- Cadastrar produtos
- Editar produtos (descrição, tipo, etc.)
- Gerenciar categorias

---

## 🛠️ Tecnologias

### Backend

- Java
- API REST

### Frontend

- React
- Vite
- JavaScript
- CSS

### Banco de Dados

- MySQL

---

## 🔐 Autenticação

O sistema utiliza autenticação básica com login e senha.

> Observação: JWT ainda não foi implementado (melhoria futura).

---

## ⚙️ Como Executar

### Backend

```bash
cd backend
mvn spring-boot:run
```
