# IF-Burguer Backend

Backend da aplicação IF-Burguer desenvolvido com **Nest.js**, **TypeScript**, **Prisma** e **MySQL**.

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- MySQL Server
- MySQL Workbench (para gerenciar o banco de dados)

## 🚀 Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados

#### a) Criar o banco de dados no MySQL Workbench:
```sql
CREATE DATABASE ifburguer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### b) Configurar arquivo .env
Edite o arquivo `.env` na raiz do projeto com suas credenciais MySQL:
```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/ifburguer"
```

### 3. Gerar migrations e sincronizar com o banco
```bash
npm run prisma:migrate
```

Isso criará todas as tabelas no seu banco de dados MySQL.

## 📊 Estrutura do Banco de Dados

O banco de dados foi criado seguindo o modelo fornecido:

### Tabelas principais:

- **usuarios** - Usuários da aplicação
- **pedido** - Pedidos realizados
- **item_pedido** - Itens dentro de cada pedido
- **produto** - Produtos do cardápio
- **localizacao** - Localizações/endereços das filiais

### Categorias de Produtos:
- Burgers
- Combos
- Bebidas
- Sobremesas
- Acompanhamentos

## 🏃 Executar o projeto

### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Iniciar em produção
```bash
npm start
```

O servidor iniciará em `http://localhost:3333/api/v1`

## 📚 Rotas da API

### Usuários
- `GET /api/v1/usuarios` - Listar todos os usuários
- `POST /api/v1/usuarios` - Criar novo usuário
- `GET /api/v1/usuarios/:id` - Obter detalhes de um usuário
- `PATCH /api/v1/usuarios/:id` - Atualizar usuário
- `DELETE /api/v1/usuarios/:id` - Deletar usuário

### Produtos
- `GET /api/v1/produtos` - Listar todos os produtos
- `POST /api/v1/produtos` - Criar novo produto
- `GET /api/v1/produtos/categoria/:categoria` - Filtrar por categoria
- `GET /api/v1/produtos/top` - Produtos em destaque
- `GET /api/v1/produtos/promocoes` - Produtos em promoção
- `GET /api/v1/produtos/:id` - Obter detalhes de um produto
- `PATCH /api/v1/produtos/:id` - Atualizar produto
- `DELETE /api/v1/produtos/:id` - Deletar produto

### Pedidos
- `GET /api/v1/pedidos` - Listar todos os pedidos
- `POST /api/v1/pedidos` - Criar novo pedido
- `GET /api/v1/pedidos/usuario/:usuarioId` - Pedidos de um usuário
- `GET /api/v1/pedidos/:id` - Obter detalhes de um pedido
- `DELETE /api/v1/pedidos/:id` - Cancelar pedido

### Localizações
- `GET /api/v1/localizacoes` - Listar todos as localizações
- `POST /api/v1/localizacoes` - Criar nova localização
- `GET /api/v1/localizacoes/destacadas` - Localizações em destaque
- `GET /api/v1/localizacoes/:id` - Obter detalhes de uma localização
- `PATCH /api/v1/localizacoes/:id` - Atualizar localização
- `DELETE /api/v1/localizacoes/:id` - Deletar localização

## 🗄️ Gerenciar o Banco de Dados

### Ver o banco de dados no Prisma Studio
```bash
npm run prisma:studio
```

Abre uma interface web em `http://localhost:5555` para gerenciar os dados.

### Criar nova migration (após alterar schema.prisma)
```bash
npm run prisma:migrate
```

## 📁 Estrutura do Projeto

```
back/
├── src/
│   ├── main.ts                 # Ponto de entrada
│   ├── app.module.ts           # Módulo raiz
│   ├── database/
│   │   └── prisma.service.ts   # Serviço do Prisma
│   └── modules/
│       ├── usuarios/           # Módulo de usuários
│       ├── pedidos/            # Módulo de pedidos
│       ├── produtos/           # Módulo de produtos
│       └── localizacoes/       # Módulo de localizações
├── prisma/
│   └── schema.prisma           # Schema do banco de dados
├── .env                        # Variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Tecnologias Utilizadas

- **Nest.js** - Framework backend
- **TypeScript** - Linguagem de programação
- **Prisma** - ORM para MySQL
- **MySQL** - Banco de dados
- **Class-validator** - Validação de dados
- **Class-transformer** - Transformação de dados

## 📝 Exemplos de Requisições

### Criar Usuário
```bash
curl -X POST http://localhost:3333/api/v1/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva"}'
```

### Criar Produto
```bash
curl -X POST http://localhost:3333/api/v1/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Burger Classic",
    "categoria": "Burgers",
    "descricao": "Sanduiche com carne, alface e tomate",
    "foto": "produtos/5/burger-classic.png",
    "preco": 15.50
  }'
```

### Criar Pedido
```bash
curl -X POST http://localhost:3333/api/v1/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": 1,
    "itens": [
      {
        "produtoId": 1,
        "quantidade": 2,
        "preco": 15.50
      },
      {
        "produtoId": 2,
        "quantidade": 1,
        "preco": 8.99
      }
    ]
  }'
```

## ⚠️ Troubleshooting

### Erro de conexão com MySQL
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão com: `mysql -u root -p`

### Erro nas migrations
```bash
# Resetar o banco de dados (CUIDADO: deleta tudo!)
npx prisma migrate reset
```

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o time de desenvolvimento.

---

**Desenvolvido para IF-Burguer** 🍔
