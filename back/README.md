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

O servidor iniciará em `http://localhost:3334/api/v1`

## 📚 Rotas da API

### Auth
- `POST /api/v1/auth/register` - Criar conta (nome, email, telefone opcional, senha)
- `POST /api/v1/auth/login` - Entrar (email e senha) e receber token JWT
- `GET /api/v1/auth/me` - Dados do usuário logado (requer autenticação)

## 👮 Admin (RBAC)

O backend agora suporta **perfis** via o campo `role` do usuário:

- `USER` (padrão)
- `ADMIN`

Rotas administrativas exigem autenticação e `role=ADMIN`.

### Criar/garantir um admin (seed)

No arquivo `.env`, defina:

```env
ADMIN_EMAIL="admin@ifburguer.com"
ADMIN_PASSWORD="123456"
ADMIN_NOME="Administrador"  # opcional
ADMIN_TELEFONE=""           # opcional
```

Depois rode:

```bash
# Banco já existente (recomendado): sincroniza o schema sem resetar dados
npx prisma db push

npm run prisma:seed
```

> Se você estiver iniciando um banco do zero e tiver um histórico de migrations local, pode usar `npm run prisma:migrate` no lugar do `db push`.

### Usuários
- `GET /api/v1/usuarios` - Listar todos os usuários (**ADMIN**)
- `POST /api/v1/usuarios` - Criar novo usuário (**ADMIN**)
- `GET /api/v1/usuarios/:id` - Obter detalhes de um usuário (**ADMIN**)
- `PATCH /api/v1/usuarios/:id` - Atualizar usuário (**ADMIN**)
- `PATCH /api/v1/usuarios/:id/role` - Alterar perfil (`USER`/`ADMIN`) (**ADMIN**)
- `DELETE /api/v1/usuarios/:id` - Deletar usuário (**ADMIN**)
- `PATCH /api/v1/usuarios/me/foto` - Atualizar foto do usuário logado (requer autenticação)

### Produtos
- `GET /api/v1/produtos` - Listar todos os produtos
- `POST /api/v1/produtos` - Criar novo produto (**ADMIN**)
- `GET /api/v1/produtos/categoria/:categoria` - Filtrar por categoria
- `GET /api/v1/produtos/top` - Produtos em destaque
- `GET /api/v1/produtos/promocoes` - Produtos em promoção
- `GET /api/v1/produtos/:id` - Obter detalhes de um produto
- `PATCH /api/v1/produtos/:id` - Atualizar produto (**ADMIN**)
- `DELETE /api/v1/produtos/:id` - Deletar produto (**ADMIN**)

### Pedidos
- `POST /api/v1/pedidos/confirmar` - Confirmar pedido do usuário logado (requer autenticação)
- `GET /api/v1/pedidos/historico` - Histórico do usuário logado (requer autenticação)
- `GET /api/v1/pedidos` - Listar todos os pedidos (**ADMIN**)
- `POST /api/v1/pedidos` - Criar novo pedido (**ADMIN**)
- `GET /api/v1/pedidos/usuario/:usuarioId` - Pedidos de um usuário (**ADMIN**)
- `GET /api/v1/pedidos/:id` - Obter detalhes de um pedido (**ADMIN**)
- `DELETE /api/v1/pedidos/:id` - Cancelar pedido (**ADMIN**)

### Localizações
- `GET /api/v1/localizacoes` - Listar todos as localizações
- `POST /api/v1/localizacoes` - Criar nova localização (**ADMIN**)
- `GET /api/v1/localizacoes/destacadas` - Localizações em destaque
- `GET /api/v1/localizacoes/:id` - Obter detalhes de uma localização
- `PATCH /api/v1/localizacoes/:id` - Atualizar localização (**ADMIN**)
- `DELETE /api/v1/localizacoes/:id` - Deletar localização (**ADMIN**)

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
curl -X POST http://localhost:3334/api/v1/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva"}'
```

### Criar Produto
```bash
curl -X POST http://localhost:3334/api/v1/produtos \
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
curl -X POST http://localhost:3334/api/v1/pedidos \
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
