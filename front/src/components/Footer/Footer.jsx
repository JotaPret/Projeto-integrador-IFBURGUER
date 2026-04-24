import Link from 'next/link'
import { Flame, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className='w-full bg-[#0a0303] border-t border-white/5 py-12'>
            <div className='px-[8%] lg:px-[16%]'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>

                    {/* Logo + Descrição */}
                    <div>
                        <div className='flex items-center gap-2 mb-4'>
                            <div className='w-9 h-9 bg-[#E31837] rounded-xl flex items-center justify-center'>
                                <Flame className='w-5 h-5 text-white' />
                            </div>
                            <span className='text-white font-black text-xl tracking-tight'>
                                IF<span className='text-[#F5A623]'>BURGER</span>
                            </span>
                        </div>
                        <p className='text-gray-500 text-sm leading-relaxed'>
                            O melhor hambúrguer artesanal da cidade. Grelhado na brasa com ingredientes premium. IF Burger - Sabor que conquista!
                        </p>
                    </div>

                    {/* Cardápio */}
                    <div>
                        <h4 className='text-white font-bold mb-4'>Cardápio</h4>
                        <ul className='space-y-2 text-gray-500 text-sm'>
                            <li><Link href='/Cardapio' className='hover:text-white transition-colors no-underline'>Burgers</Link></li>
                            <li><Link href='/Cardapio' className='hover:text-white transition-colors no-underline'>Combos</Link></li>
                            <li><Link href='/Cardapio' className='hover:text-white transition-colors no-underline'>Bebidas</Link></li>
                            <li><Link href='/Cardapio' className='hover:text-white transition-colors no-underline'>Sobremesas</Link></li>
                        </ul>
                    </div>

                    {/* Empresa */}
                    <div>
                        <h4 className='text-white font-bold mb-4'>Empresa</h4>
                        <ul className='space-y-2 text-gray-500 text-sm'>
                            <li><Link href='/localizacoes' className='hover:text-white transition-colors no-underline'>Nossas Lojas</Link></li>
                            <li><Link href='/promocoes' className='hover:text-white transition-colors no-underline'>Promoções</Link></li>
                        </ul>
                    </div>

                    {/* Contato */}
                    <div>
                        <h4 className='text-white font-bold mb-4'>Contato</h4>
                        <ul className='space-y-3 text-gray-500 text-sm'>
                            <li className='flex items-center gap-2'>
                                <Phone className='w-4 h-4' />
                                (11) 99999-9999
                            </li>
                            <li className='flex items-center gap-2'>
                                <MapPin className='w-4 h-4' />
                                São Paulo, SP
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Copyright */}
                <div className='border-t border-white/5 mt-8 pt-6 text-center text-gray-600 text-sm'>
                    © 2026 IF Burger. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    )
}