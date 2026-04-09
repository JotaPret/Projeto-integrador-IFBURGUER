-- 📋 Dados de exemplo para testar a API

-- ============================================
-- USUÁRIOS
-- ============================================
INSERT INTO usuarios (nome) VALUES
('João Silva'),
('Maria Santos'),
('Pedro Oliveira'),
('Ana Costa'),
('Carlos Mendes');

-- ============================================
-- LOCALIZAÇÕES
-- ============================================
INSERT INTO localizacao (titulo, destaque) VALUES
('Loja Centro - Rua Principal, 123', 1),
('Loja Malls - Shopping Center, 456', 1),
('Loja Bairro - Av. Secundária, 789', 0),
('Loja Aeroporto - Piso 2, Terminal 1', 1);

-- ============================================
-- PRODUTOS
-- ============================================

-- BURGERS
INSERT INTO produto (titulo, categoria, descricao, foto, preco, top, avaliacao, freteGratis, desconto, fimDesconto) VALUES
('Burger Classic', 'Burgers', 'Pão, carne 150g, alface, tomate, queijo e molho', 'produtos/5/burger-classic.png', 15.50, 1, 4.5, 0, 0, NULL),
('Burger Bacon', 'Burgers', 'Pão, carne 150g, bacon, queijo cheddar, cebola roxa', 'produtos/5/burger-bacon.png', 18.90, 1, 4.8, 0, 10, DATE_ADD(NOW(), INTERVAL 7 DAY)),
('Burger Premium', 'Burgers', 'Pão artesanal, 2 carnes 100g cada, bacon, 3 queijos, alface', 'produtos/5/burger-premium.png', 25.90, 1, 5.0, 0, 0, NULL),
('Burger Vegano', 'Burgers', 'Pão integral, hambúrguer de soja, alface, tomate, rúcula', 'produtos/5/burger-vegano.png', 14.90, 0, 4.2, 0, 0, NULL);

-- COMBOS
INSERT INTO produto (titulo, categoria, descricao, foto, preco, top, avaliacao, freteGratis, desconto, fimDesconto) VALUES
('Combo Clássico', 'Combos', 'Burger Classic + Batata Média + Refrigerante 330ml', 'produtos/5/combo-classico.png', 29.90, 1, 4.6, 0, 0, NULL),
('Combo Premium', 'Combos', 'Burger Premium + Batata Grande + Refrigerante 500ml + Sobremesa', 'produtos/5/combo-premium.png', 49.90, 1, 4.9, 0, 5, DATE_ADD(NOW(), INTERVAL 14 DAY)),
('Combo Família', 'Combos', '3 Burgers + 2 Batatas Grandes + 2 Refrigerantes 1L', 'produtos/5/combo-familia.png', 89.90, 0, 4.7, 1, 0, NULL);

-- BEBIDAS
INSERT INTO produto (titulo, categoria, descricao, foto, preco, top, avaliacao, freteGratis, desconto, fimDesconto) VALUES
('Refrigerante Coca 350ml', 'Bebidas', 'Refrigerante gelado - Coca-Cola 350ml', 'produtos/5/coca-350.png', 4.50, 0, 4.3, 0, 0, NULL),
('Refrigerante Coca 1L', 'Bebidas', 'Refrigerante gelado - Coca-Cola 1 litro', 'produtos/5/coca-1l.png', 8.90, 0, 4.5, 1, 0, NULL),
('Suco Natural', 'Bebidas', 'Suco natural de frutas frescas - Laranja ou Melancia', 'produtos/5/suco-natural.png', 7.90, 1, 4.7, 0, 0, NULL),
('Milkshake', 'Bebidas', 'Milkshake gelado - Chocolate, Morango ou Vanilla', 'produtos/5/milkshake.png', 11.90, 1, 4.8, 0, 0, NULL);

-- SOBREMESAS
INSERT INTO produto (titulo, categoria, descricao, foto, preco, top, avaliacao, freteGratis, desconto, fimDesconto) VALUES
('Sorvete 2 Bolas', 'Sobremesas', 'Sorvete de qualidade - 2 bolas - várias sabores', 'produtos/5/sorvete-2bolas.png', 8.90, 1, 4.9, 0, 0, NULL),
('Brownie com Chocolate', 'Sobremesas', 'Brownie quente com cobertura de chocolate derretido', 'produtos/5/brownie.png', 9.90, 0, 4.8, 0, 15, DATE_ADD(NOW(), INTERVAL 3 DAY)),
('Torta de Chocolate', 'Sobremesas', 'Fatia generosa de torta de chocolate belga', 'produtos/5/torta-chocolate.png', 12.90, 0, 5.0, 0, 0, NULL);

-- ACOMPANHAMENTOS
INSERT INTO produto (titulo, categoria, descricao, foto, preco, top, avaliacao, freteGratis, desconto, fimDesconto) VALUES
('Batata Pequena', 'Acompanhamentos', 'Batata frita crocante - Pequena', 'produtos/5/batata-pequena.png', 7.90, 0, 4.5, 0, 0, NULL),
('Batata Média', 'Acompanhamentos', 'Batata frita crocante - Média', 'produtos/5/batata-media.png', 10.90, 0, 4.6, 0, 0, NULL),
('Batata Grande', 'Acompanhamentos', 'Batata frita crocante - Grande', 'produtos/5/batata-grande.png', 13.90, 1, 4.7, 0, 0, NULL),
('Anilha de Cebola', 'Acompanhamentos', 'Anilha de cebola crocante e quente', 'produtos/5/anilha-cebola.png', 8.90, 0, 4.4, 0, 0, NULL),
('Seleção de Sauces', 'Acompanhamentos', '3 Sacos de diferentes sauces: maionese, ketchup, mostarda', 'produtos/5/sauces.png', 3.90, 0, 4.2, 0, 0, NULL);

-- ============================================
-- PEDIDOS (Exemplos)
-- ============================================
-- Pedido 1 - João Silva
INSERT INTO pedido (data, usuarios_id) VALUES (NOW(), 1);
INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco) VALUES 
(1, 1, 2, 15.50),  -- 2x Burger Classic
(1, 11, 1, 8.90);  -- 1x Suco Natural

-- Pedido 2 - Maria Santos
INSERT INTO pedido (data, usuarios_id) VALUES (DATE_SUB(NOW(), INTERVAL 1 DAY), 2);
INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco) VALUES 
(2, 3, 1, 25.90),  -- 1x Burger Premium
(2, 16, 1, 13.90), -- 1x Batata Grande
(2, 10, 1, 11.90); -- 1x Milkshake

-- Pedido 3 - Pedro Oliveira
INSERT INTO pedido (data, usuarios_id) VALUES (DATE_SUB(NOW(), INTERVAL 2 DAY), 3);
INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco) VALUES 
(3, 5, 1, 29.90);  -- 1x Combo Clássico

-- ============================================
-- Verificar dados inseridos
-- ============================================
-- SELECT * FROM usuarios;
-- SELECT * FROM localizacao;
-- SELECT * FROM produto WHERE categoria = 'Burgers';
-- SELECT p.*, u.nome FROM pedido p JOIN usuarios u ON p.usuarios_id = u.id;
-- SELECT ip.*, pr.titulo FROM item_pedido ip JOIN produto pr ON ip.produto_id = pr.id;
