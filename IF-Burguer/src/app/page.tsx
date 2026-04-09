import HeroBanner from '@/components/Home/HeroBanner'
import PromocoesDodia from '@/components/Home/PromocoesDodia'
import MaisPedidos from '@/components/Home/MaisPedidos'
import Footer from '@/components/Footer/Footer'



export default function Home() {
    return (
        <main>
            <HeroBanner />
            <div className='w-full h-16 bg-gradient-to-b from-[#1a0505] to-[#0f0505]' />
            <PromocoesDodia />
            <MaisPedidos />
            <Footer />
        </main>
    )
}