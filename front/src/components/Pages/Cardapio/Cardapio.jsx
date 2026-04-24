'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Flame, UtensilsCrossed, Coffee, IceCream, Salad } from 'lucide-react'
import { useCart } from '@/components/Cart/CartContext'
import { toCartId } from '@/components/Cart/cart-utils'
import Footer from '@/components/Footer/Footer'

const categorias = [
    { id: 'burgers', label: 'Burgers', icon: Flame },
    { id: 'combos', label: 'Combos', icon: UtensilsCrossed },
    { id: 'bebidas', label: 'Bebidas', icon: Coffee },
    { id: 'sobremesas', label: 'Sobremesas', icon: IceCream },
    { id: 'acompanhamentos', label: 'Acompanhamentos', icon: Salad },
]

const produtos = {
    burgers: [
        { id: 1, nome: 'Texas BBQ Burger', descricao: 'Blend 200g, bacon defumado, cebola caramelizada, queijo...', preco: 36.90, top: false, imagem: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop' },
        { id: 2, nome: 'Chicken Crispy', descricao: 'Filé de frango empanado crocante, alface, tomate, queijo...', preco: 28.90, top: false, imagem: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop' },
        { id: 3, nome: 'Blue Cheese Burger', descricao: 'Blend 180g, queijo gorgonzola, rúcula, cebola roxa e molho...', preco: 39.90, top: true, imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
        { id: 4, nome: 'Smash Burger Clássico', descricao: 'Dois smash de 90g, queijo cheddar, cebola caramelizada...', preco: 32.90, top: true, imagem: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop' },
        { id: 5, nome: 'Bacon Lover', descricao: 'Blend de 180g, bacon crocante, queijo prato, cebola roxa e...', preco: 38.90, top: true, imagem: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca368f?w=400&h=300&fit=crop' },
        { id: 6, nome: 'Veggie Burger', descricao: 'Hambúrguer de grão de bico, queijo muçarela, rúcula, tomat...', preco: 29.90, top: false, imagem: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop' },
        { id: 7, nome: 'Double Cheese', descricao: 'Dois blends de 120g, triplo queijo cheddar, cebola crispy e...', preco: 42.90, top: false, imagem: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop' },
    ],
    combos: [
        { id: 8, nome: 'Combo Triplo', descricao: '3 Smash Burgers + 3 Batatas médias + 3 Refrigerantes 500ml', preco: 109.90, top: false, imagem: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&h=300&fit=crop' },
        { id: 9, nome: 'Combo Kids', descricao: 'Mini burger + Batata pequena + Suco de caixinha +...', preco: 32.90, top: false, imagem: 'https://images.unsplash.com/photo-1550950158-d0d960dff596?w=400&h=300&fit=crop' },
        { id: 10, nome: 'Combo Individual', descricao: '1 Smash Burger + Batata média + Refrigerante 500ml', preco: 45.90, top: true, imagem: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=300&fit=crop' },
        { id: 11, nome: 'Combo Duplo', descricao: '2 Smash Burgers + 2 Batatas médias + 2 Refrigerantes', preco: 79.90, top: false, imagem: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop' },
    ],
    bebidas: [
        { id: 12, nome: 'Guaraná Antarctica 500ml', descricao: 'Refrigerante Guaraná Antarctica gelado', preco: 7.90, top: false, imagem: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=300&fit=crop' },
        { id: 13, nome: 'Água Mineral 500ml', descricao: 'Água mineral sem gás', preco: 4.90, top: false, imagem: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop' },
        { id: 14, nome: 'Milkshake Morango', descricao: 'Milkshake cremoso de morango com chantilly e calda', preco: 18.90, top: false, imagem: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop' },
        { id: 15, nome: 'Milkshake Ovomaltine', descricao: 'Milkshake de Ovomaltine com pedaços crocantes', preco: 19.90, top: true, imagem: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=300&fit=crop' },
        { id: 16, nome: 'Coca-Cola 500ml', descricao: 'Refrigerante Coca-Cola gelado', preco: 8.90, top: false, imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop' },
        { id: 17, nome: 'Milkshake Chocolate', descricao: 'Milkshake cremoso de chocolate belga com chantilly', preco: 18.90, top: true, imagem: 'https://images.unsplash.com/photo-1585670347532-e045e4abe1e9?w=400&h=300&fit=crop' },
        { id: 18, nome: 'Suco Natural Laranja', descricao: 'Suco de laranja natural 400ml', preco: 12.90, top: false, imagem: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop' },
    ],
    sobremesas: [
        { id: 19, nome: 'Petit Gateau', descricao: 'Bolo de chocolate quente com sorvete de creme e calda', preco: 22.90, top: true, imagem: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop' },
        { id: 20, nome: 'Brownie com Sorvete', descricao: 'Brownie quentinho com sorvete de baunilha e calda', preco: 19.90, top: false, imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e341154?w=400&h=300&fit=crop' },
        { id: 21, nome: 'Churros com Nutella', descricao: 'Churros crocante recheado com Nutella e canela', preco: 16.90, top: false, imagem: 'https://images.unsplash.com/photo-1624355651893-c88ac00b5a07?w=400&h=300&fit=crop' },
    ],
    acompanhamentos: [
        { id: 22, nome: 'Batata Cheddar Bacon', descricao: 'Batata frita crocante com cheddar cremoso e bacon', preco: 24.90, top: true, imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
        { id: 23, nome: 'Batata Frita', descricao: 'Batata frita crocante temperada', preco: 14.90, top: false, imagem: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop' },
        { id: 24, nome: 'Onion Rings', descricao: 'Anéis de cebola empanados e fritos', preco: 18.90, top: false, imagem: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop' },
        { id: 25, nome: 'Nuggets 10un', descricao: '10 nuggets crocantes com molho à escolha', preco: 21.90, top: false, imagem: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=300&fit=crop' },
    ],
}

export default function Cardapio() {
    const [categoriaAtiva, setCategoriaAtiva] = useState('burgers')
    const { addItem } = useCart()

    const itens = produtos[categoriaAtiva]
    const categoriaInfo = categorias.find(c => c.id === categoriaAtiva)

    const handleAddItem = item => {
        addItem({
            id: toCartId(item.nome),
            produtoId: item.id,
            name: item.nome,
            description: item.descricao,
            image: item.imagem,
            price: item.preco,
        })
    }

    return (
        <div className='min-h-screen bg-[var(--prim)]'>
            <div className='px-[8%] lg:px-[16%] py-10'>

                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-white font-black text-4xl md:text-5xl'>Cardápio</h1>
                    <p className='text-gray-500 mt-1'>Escolha seus favoritos</p>
                </div>

                {/* Categoria Tabs */}
                <div className='flex items-center gap-3 flex-wrap mb-12'>
                    {categorias.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setCategoriaAtiva(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer border-none
                                ${categoriaAtiva === id
                                    ? 'bg-white text-[#0f0505]'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon className='w-4 h-4' />
                            {label}
                        </button>
                    ))}
                </div>

                <div className='border-t border-white/10 mb-10' />

                {/* Seção de Produtos */}
                <div className='mb-6'>
                    <h2 className='text-white font-black text-3xl'>{categoriaInfo?.label}</h2>
                    <p className='text-gray-500 text-sm mt-1'>{itens.length} itens disponíveis</p>
                </div>

                {/* Grid de Produtos */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {itens.map((item) => (
                        <div key={item.id} className='bg-[#1a0a0a] rounded-2xl overflow-hidden border border-white/5 flex flex-col'>
                            {/* Image */}
                            <div className='relative h-44'>
                                <Image
                                    src={item.imagem}
                                    alt={item.nome}
                                    fill
                                    className='object-cover'
                                />
                                {item.top && (
                                    <span className='absolute top-2 left-2 bg-[#F5A623] text-[#0f0505] text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1'>
                                        <Flame className='w-3 h-3' /> TOP
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className='p-3 flex flex-col flex-1'>
                                <h3 className='text-white font-bold text-sm'>{item.nome}</h3>
                                <p className='text-gray-500 text-xs mt-1 mb-3 line-clamp-2'>{item.descricao}</p>

                                <div className='flex items-center justify-between mt-auto'>
                                    <span className='text-[#E31837] font-black text-sm'>
                                        R$ {item.preco.toFixed(2).replace('.', ',')}
                                    </span>
                                    <button
                                        onClick={() => handleAddItem(item)}
                                        className='bg-[#E31837] hover:opacity-90 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-opacity cursor-pointer border-none'
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}