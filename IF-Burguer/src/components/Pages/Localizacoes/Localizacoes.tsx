'use client'
import { useState } from 'react'
import { MapPin, Clock, Phone, Star, Navigation, Send } from 'lucide-react'
import Footer from '@/components/Footer/Footer'

type Loja = {
    id: number
    nome: string
    endereco: string
    cidade: string
    horario: string
    telefone: string
    avaliacao: number
    destaque: boolean
    maps: string
}

const lojas: Loja[] = [
    {
        id: 1,
        nome: 'IF Burger - Paulista',
        endereco: 'Av. Paulista, 1000 - Bela Vista',
        cidade: 'São Paulo, SP',
        horario: 'Seg-Dom: 11h – 23h',
        telefone: '(11) 3000-1001',
        avaliacao: 4.9,
        destaque: true,
        maps: 'https://maps.google.com/?q=Av.+Paulista,+1000,+São+Paulo',
    },
    {
        id: 2,
        nome: 'IF Burger - Pinheiros',
        endereco: 'Rua dos Pinheiros, 500 - Pinheiros',
        cidade: 'São Paulo, SP',
        horario: 'Seg-Dom: 11h – 23h',
        telefone: '(11) 3000-1002',
        avaliacao: 4.8,
        destaque: false,
        maps: 'https://maps.google.com/?q=Rua+dos+Pinheiros,+500,+São+Paulo',
    },
    {
        id: 3,
        nome: 'IF Burger - Moema',
        endereco: 'Av. Ibirapuera, 2000 - Moema',
        cidade: 'São Paulo, SP',
        horario: 'Seg-Dom: 11h – 23h',
        telefone: '(11) 3000-1003',
        avaliacao: 4.7,
        destaque: false,
        maps: 'https://maps.google.com/?q=Av.+Ibirapuera,+2000,+São+Paulo',
    },
    {
        id: 4,
        nome: 'IF Burger - Vila Olímpia',
        endereco: 'Rua Funchal, 300 - Vila Olímpia',
        cidade: 'São Paulo, SP',
        horario: 'Seg-Dom: 11h – 23h',
        telefone: '(11) 3000-1004',
        avaliacao: 4.6,
        destaque: false,
        maps: 'https://maps.google.com/?q=Rua+Funchal,+300,+São+Paulo',
    },
]

export default function Localizacoes() {
    const [lojaSelecionada, setLojaSelecionada] = useState<Loja>(lojas[0])
    const [busca, setBusca] = useState<string>('')

    const lojasFiltradas = lojas.filter(loja =>
        loja.nome.toLowerCase().includes(busca.toLowerCase()) ||
        loja.endereco.toLowerCase().includes(busca.toLowerCase()) ||
        loja.cidade.toLowerCase().includes(busca.toLowerCase())
    )

    return (
        <div className='min-h-screen bg-[var(--prim)]'>
            <div className='px-[8%] lg:px-[16%] py-10'>

                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='w-10 h-10 bg-[#E31837] rounded-xl flex items-center justify-center'>
                        <MapPin className='w-5 h-5 text-white' />
                    </div>
                    <div>
                        <h1 className='text-white font-black text-4xl md:text-5xl'>Nossas Lojas</h1>
                        <p className='text-gray-500 text-sm mt-0.5'>Encontre a unidade mais próxima</p>
                    </div>
                </div>

                {/* Search */}
                <div className='relative mb-6'>
                    <div className='absolute left-4 top-1/2 -translate-y-1/2'>
                        <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                    </div>
                    <input
                        type='text'
                        placeholder='Buscar por endereço, bairro ou cidade...'
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className='w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-2xl pl-10 pr-4 py-3.5 outline-none focus:border-[#E31837] transition-colors text-sm'
                    />
                </div>

                {/* Main Content */}
                <div className='grid lg:grid-cols-2 gap-4 mb-10'>

                    {/* Lista de Lojas */}
                    <div className='space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-hide'>
                        {lojasFiltradas.map((loja) => (
                            <div
                                key={loja.id}
                                onClick={() => setLojaSelecionada(loja)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all
                                    ${lojaSelecionada.id === loja.id
                                        ? 'bg-[#E31837]/10 border-[#E31837]'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className='flex items-center justify-between mb-2'>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='text-white font-bold text-sm'>{loja.nome}</h3>
                                        {loja.destaque && (
                                            <span className='bg-[#F5A623] text-[#0f0505] text-[10px] font-black px-2 py-0.5 rounded-full'>
                                                DESTAQUE
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Star className='w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]' />
                                        <span className='text-white text-xs font-bold'>{loja.avaliacao}</span>
                                    </div>
                                </div>

                                <p className='text-gray-400 text-xs'>{loja.endereco}</p>
                                <p className='text-gray-600 text-xs mb-3'>{loja.cidade}</p>

                                <div className='flex items-center gap-4 text-gray-500 text-xs mb-3'>
                                    <span className='flex items-center gap-1'>
                                        <Clock className='w-3.5 h-3.5' />
                                        {loja.horario}
                                    </span>
                                    <span className='flex items-center gap-1'>
                                        <Phone className='w-3.5 h-3.5' />
                                        {loja.telefone}
                                    </span>
                                </div>

                                <button className='w-full bg-[#E31837] hover:opacity-90 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer transition-opacity'>
                                    <Navigation className='w-3.5 h-3.5' />
                                    Como Chegar
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Painel da Loja Selecionada */}
                    <div className='bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[300px]'>
                        <div className='w-16 h-16 bg-[#E31837]/20 rounded-full flex items-center justify-center mb-4'>
                            <MapPin className='w-8 h-8 text-[#E31837]' />
                        </div>
                        <h3 className='text-white font-bold text-lg mb-1'>{lojaSelecionada.nome}</h3>
                        <p className='text-gray-500 text-sm mb-6'>{lojaSelecionada.endereco}</p>
                        <button className='bg-[#E31837] hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-full text-sm border-none cursor-pointer transition-opacity'>
                            Abrir no Google Maps
                        </button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-white/5 border border-white/10 rounded-2xl p-6 text-center'>
                        <div className='w-10 h-10 bg-[#E31837]/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                            <Clock className='w-5 h-5 text-[#E31837]' />
                        </div>
                        <h4 className='text-white font-bold mb-1'>Horário de Funcionamento</h4>
                        <p className='text-gray-500 text-sm'>Segunda a Domingo</p>
                        <p className='text-gray-500 text-sm'>11h às 23h</p>
                    </div>
                    <div className='bg-white/5 border border-white/10 rounded-2xl p-6 text-center'>
                        <div className='w-10 h-10 bg-[#F5A623]/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                            <Phone className='w-5 h-5 text-[#F5A623]' />
                        </div>
                        <h4 className='text-white font-bold mb-1'>Central de Atendimento</h4>
                        <p className='text-gray-500 text-sm'>0800 123 4567</p>
                        <p className='text-gray-500 text-sm'>Todos os dias, 24h</p>
                    </div>
                    <div className='bg-white/5 border border-white/10 rounded-2xl p-6 text-center'>
                        <div className='w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                            <Send className='w-5 h-5 text-green-500' />
                        </div>
                        <h4 className='text-white font-bold mb-1'>Delivery</h4>
                        <p className='text-gray-500 text-sm'>Entrega em até 30 min.</p>
                        <p className='text-gray-500 text-sm'>Frete grátis acima de R$50</p>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}