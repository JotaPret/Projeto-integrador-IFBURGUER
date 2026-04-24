import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/client';

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  throw new Error('Missing env var DATABASE_URL');
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(databaseUrl),
});

type SeedProduto = {
  id: number;
  titulo: string;
  categoria: string;
  descricao: string;
  foto: string;
  preco: number;
  top?: number;
  avaliacao?: number;
  freteGratis?: number;
  desconto?: number;
};

const produtos: SeedProduto[] = [
  // Burgers
  {
    id: 1,
    titulo: 'Texas BBQ Burger',
    categoria: 'Burgers',
    descricao: 'Blend 200g, bacon defumado, cebola caramelizada, queijo...',
    foto: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
    preco: 36.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 2,
    titulo: 'Chicken Crispy',
    categoria: 'Burgers',
    descricao: 'Filé de frango empanado crocante, alface, tomate, queijo...',
    foto: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop',
    preco: 28.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 3,
    titulo: 'Blue Cheese Burger',
    categoria: 'Burgers',
    descricao: 'Blend 180g, queijo gorgonzola, rúcula, cebola roxa e molho...',
    foto: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    preco: 39.9,
    top: 1,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 4,
    titulo: 'Smash Burger Clássico',
    categoria: 'Burgers',
    descricao: 'Dois smash de 90g, queijo cheddar, cebola caramelizada...',
    foto: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
    preco: 32.9,
    top: 1,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 5,
    titulo: 'Bacon Lover',
    categoria: 'Burgers',
    descricao: 'Blend de 180g, bacon crocante, queijo prato, cebola roxa e...',
    foto: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca368f?w=400&h=300&fit=crop',
    preco: 38.9,
    top: 1,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 6,
    titulo: 'Veggie Burger',
    categoria: 'Burgers',
    descricao: 'Hambúrguer de grão de bico, queijo muçarela, rúcula, tomat...',
    foto: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop',
    preco: 29.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 7,
    titulo: 'Double Cheese',
    categoria: 'Burgers',
    descricao: 'Dois blends de 120g, triplo queijo cheddar, cebola crispy e...',
    foto: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    preco: 42.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },

  // Combos
  {
    id: 8,
    titulo: 'Combo Triplo',
    categoria: 'Combos',
    descricao: '3 Smash Burgers + 3 Batatas médias + 3 Refrigerantes 500ml',
    foto: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&h=300&fit=crop',
    preco: 109.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 9,
    titulo: 'Combo Kids',
    categoria: 'Combos',
    descricao: 'Mini burger + Batata pequena + Suco de caixinha +...',
    foto: 'https://images.unsplash.com/photo-1550950158-d0d960dff596?w=400&h=300&fit=crop',
    preco: 32.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 10,
    titulo: 'Combo Individual',
    categoria: 'Combos',
    descricao: '1 Smash Burger + Batata média + Refrigerante 500ml',
    foto: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=300&fit=crop',
    preco: 45.9,
    top: 1,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 11,
    titulo: 'Combo Duplo',
    categoria: 'Combos',
    descricao: '2 Smash Burgers + 2 Batatas médias + 2 Refrigerantes',
    foto: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop',
    preco: 79.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },

  // Bebidas
  {
    id: 12,
    titulo: 'Guaraná Antarctica 500ml',
    categoria: 'Bebidas',
    descricao: 'Refrigerante Guaraná Antarctica gelado',
    foto: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=300&fit=crop',
    preco: 7.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 13,
    titulo: 'Água Mineral 500ml',
    categoria: 'Bebidas',
    descricao: 'Água mineral sem gás',
    foto: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
    preco: 4.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 14,
    titulo: 'Milkshake Morango',
    categoria: 'Bebidas',
    descricao: 'Milkshake cremoso de morango com chantilly e calda',
    foto: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
    preco: 18.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 15,
    titulo: 'Milkshake Ovomaltine',
    categoria: 'Bebidas',
    descricao: 'Milkshake de Ovomaltine com pedaços crocantes',
    foto: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=300&fit=crop',
    preco: 19.9,
    top: 1,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 16,
    titulo: 'Coca-Cola 500ml',
    categoria: 'Bebidas',
    descricao: 'Refrigerante Coca-Cola gelado',
    foto: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop',
    preco: 8.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 17,
    titulo: 'Milkshake Chocolate',
    categoria: 'Bebidas',
    descricao: 'Milkshake cremoso de chocolate belga com chantilly',
    foto: 'https://images.unsplash.com/photo-1585670347532-e045e4abe1e9?w=400&h=300&fit=crop',
    preco: 18.9,
    top: 1,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 18,
    titulo: 'Suco Natural Laranja',
    categoria: 'Bebidas',
    descricao: 'Suco de laranja natural 400ml',
    foto: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
    preco: 12.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },

  // Sobremesas
  {
    id: 19,
    titulo: 'Petit Gateau',
    categoria: 'Sobremesas',
    descricao: 'Bolo de chocolate quente com sorvete de creme e calda',
    foto: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
    preco: 22.9,
    top: 1,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 20,
    titulo: 'Brownie com Sorvete',
    categoria: 'Sobremesas',
    descricao: 'Brownie quentinho com sorvete de baunilha e calda',
    foto: 'https://images.unsplash.com/photo-1606313564200-e75d5e341154?w=400&h=300&fit=crop',
    preco: 19.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 21,
    titulo: 'Churros com Nutella',
    categoria: 'Sobremesas',
    descricao: 'Churros crocante recheado com Nutella e canela',
    foto: 'https://images.unsplash.com/photo-1624355651893-c88ac00b5a07?w=400&h=300&fit=crop',
    preco: 16.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },

  // Acompanhamentos
  {
    id: 22,
    titulo: 'Batata Cheddar Bacon',
    categoria: 'Acompanhamentos',
    descricao: 'Batata frita crocante com cheddar cremoso e bacon',
    foto: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    preco: 24.9,
    top: 1,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 23,
    titulo: 'Batata Frita',
    categoria: 'Acompanhamentos',
    descricao: 'Batata frita crocante temperada',
    foto: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop',
    preco: 14.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 24,
    titulo: 'Onion Rings',
    categoria: 'Acompanhamentos',
    descricao: 'Anéis de cebola empanados e fritos',
    foto: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop',
    preco: 18.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
  {
    id: 25,
    titulo: 'Nuggets 10un',
    categoria: 'Acompanhamentos',
    descricao: '10 nuggets crocantes com molho à escolha',
    foto: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=300&fit=crop',
    preco: 21.9,
    top: 0,
    avaliacao: 0,
    freteGratis: 0,
    desconto: 0,
  },
];

async function main() {
  await prisma.$connect();

  for (const produto of produtos) {
    await prisma.produto.upsert({
      where: { id: produto.id },
      update: {
        titulo: produto.titulo,
        categoria: produto.categoria,
        descricao: produto.descricao,
        foto: produto.foto,
        preco: produto.preco,
        top: produto.top,
        avaliacao: produto.avaliacao,
        freteGratis: produto.freteGratis,
        desconto: produto.desconto,
      },
      // `id` é autoincrement no schema; aqui usamos seed determinístico com cast.
      create: produto as any,
    });
  }

  const total = await prisma.produto.count();
  console.log(`✅ Seed concluído. Produtos na base: ${total}`);
}

main()
  .catch((error) => {
    console.error('❌ Falha ao rodar seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
