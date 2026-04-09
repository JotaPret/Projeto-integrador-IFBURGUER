# 🗄️ Instruções para Configurar o MySQL

## Passo 1: Instalar MySQL Server

### Windows
1. Baixe em: https://dev.mysql.com/downloads/mysql/
2. Execute o instalador
3. Escolha "Server only" para uma instalação básica
4. Configure para rodar como serviço

### macOS
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

## Passo 2: Acessar MySQL via linha de comando

```bash
mysql -u root -p
```

Se for a primeira vez, a senha pode estar vazia. Pressione ENTER.

## Passo 3: Criar o banco de dados ifburguer

```sql
-- Copie e cole no MySQL para criar o banco
CREATE DATABASE ifburguer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar se foi criado
SHOW DATABASES;

-- Usar o banco
USE ifburguer;
```

## Passo 4: Configurar o arquivo .env

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o `.env` com suas credenciais MySQL:
   ```env
   DATABASE_URL="mysql://root:sua_senha@localhost:3306/ifburguer"
   ```

## Passo 5: Aplicar as migrations do Prisma

```bash
npm run prisma:migrate
```

Isso criará automaticamente todas as tabelas no seu banco de dados.

## Passo 6: Usar MySQL Workbench (Opcional)

1. Baixe em: https://dev.mysql.com/downloads/workbench/
2. Abra o Workbench
3. Crie uma nova conexão com:
   - **Hostname**: localhost
   - **Port**: 3306
   - **Username**: root
   - **Password**: sua_senha
4. Teste a conexão

## Verificar se as tabelas foram criadas

No terminal MySQL:
```sql
USE ifburguer;
SHOW TABLES;
DESCRIBE usuarios;
DESCRIBE produto;
DESCRIBE pedido;
DESCRIBE item_pedido;
DESCRIBE localizacao;
```

## 🐛 Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Verifique a senha no `.env`
- Tente com senha vazia (deixe em branco)

### "Unknown database 'ifburguer'"
- Execute: `CREATE DATABASE ifburguer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

### "Prisma migration error"
```bash
# Resetar banco (DELETA TUDO!)
npx prisma migrate reset

# Ou criar nova migration
npx prisma migrate dev --name init
```

## 📊 Gerenciar dados com Prisma Studio

```bash
npm run prisma:studio
```

Abre em http://localhost:5555 - permite visualizar e editar dados graficamente.

---

**Após completar esses passos, você está pronto para rodar o backend!**
