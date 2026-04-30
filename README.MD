🍔 Delivery App

Sistema completo de delivery com área do cliente e painel administrativo, desenvolvido utilizando arquitetura cliente-servidor, com foco em escalabilidade, organização e boas práticas de desenvolvimento.

📖 Visão Geral

A aplicação permite que usuários realizem pedidos de forma simples e intuitiva, enquanto administradores possuem controle total sobre produtos e gerenciamento de pedidos.

O sistema foi projetado com separação clara entre frontend e backend, seguindo o padrão de APIs REST.

🧩 Arquitetura
delivery-app/
│
├── backend/ # API REST em Java
├── frontend/ # Interface em React (Vite)
└── README.md
Frontend: Responsável pela interface e experiência do usuário
Backend: Responsável pelas regras de negócio e persistência de dados
👤 Funcionalidades
Cliente
Autenticação (login e cadastro)
Gerenciamento de endereço (incluindo endereço principal)
Navegação por produtos
Carrinho de compras
Criação de pedidos
Visualização de pedidos realizados
Administrador
Visualização de todos os pedidos
Atualização de status dos pedidos
Cadastro de produtos
Edição de produtos (descrição, tipo, etc.)
Gerenciamento de categorias
🛠️ Tecnologias Utilizadas
Backend
Java
API REST
(Opcional: Spring Boot — ajuste se aplicável)
Frontend
React
Vite
JavaScript (ES6+)
CSS
Banco de Dados
MySQL
🔐 Autenticação

O sistema utiliza autenticação baseada em login e senha.

⚠️ Nota: A implementação atual não utiliza JWT ou outro mecanismo de token. Essa melhoria está planejada para versões futuras.

⚙️ Execução do Projeto
🔙 Backend
cd backend
./mvnw spring-boot:run

Caso não utilize Maven Wrapper, use:

mvn spring-boot:run
🔜 Frontend
cd frontend
npm install
npm run dev
🌐 Endpoints (Exemplo)
Método Endpoint Descrição
GET /produtos Listar produtos
POST /pedidos Criar pedido
PUT /pedidos/{id} Atualizar status
POST /auth/login Autenticação
📌 Roadmap
Implementar autenticação com JWT
Integração com gateway de pagamento
Notificações em tempo real
Dashboard administrativo com métricas
Deploy em ambiente cloud
🧪 Boas Práticas Aplicadas
Separação de responsabilidades (Frontend/Backend)
Arquitetura baseada em API REST
Organização modular do código
Padronização de rotas e estrutura
