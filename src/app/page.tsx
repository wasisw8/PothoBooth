import Link from 'next/link';
import { Camera, Sparkles, Download, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-6xl md:text-8xl mb-6 animate-bounce-soft">📸</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 tracking-tight">
            Say <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Cheese!</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 font-medium max-w-2xl mx-auto">
            Photo Booth Online Paling Seru! Foto kapan aja, di mana aja dengan template lucu dan imut.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="w-full sm:w-auto text-lg group">
                Mulai Foto Sekarang!
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/history">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg">
                Lihat Galeri
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Floating decorations */}
        <div className="absolute top-1/4 left-10 md:left-32 text-4xl opacity-50 animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute top-1/3 right-10 md:right-32 text-4xl opacity-50 animate-pulse">💖</div>
        <div className="absolute bottom-1/4 left-20 md:left-48 text-4xl opacity-50 animate-bounce" style={{ animationDelay: '1s' }}>⭐</div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Kenapa PothoBooth? 🤔
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center group">
              <div className="w-16 h-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Template Lucu</h3>
              <p className="text-gray-600">Ratusan template frame unik yang bikin fotomu makin aesthetic dan imut!</p>
            </Card>
            <Card className="text-center group" variant="highlighted">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Foto Berkualitas</h3>
              <p className="text-gray-600">Hasil jepretan jernih dengan filter cantik yang bikin kamu makin pede.</p>
            </Card>
            <Card className="text-center group">
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⬇️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Download Langsung</h3>
              <p className="text-gray-600">Selesai foto, langsung bisa di-download atau di-share ke medsos!</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Gampang Banget Caranya! ✨
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { step: 1, title: 'Login', icon: '👤' },
              { step: 2, title: 'Bayar', icon: '💳' },
              { step: 3, title: 'Pilih Template', icon: '🖼️' },
              { step: 4, title: 'Foto!', icon: '🤩' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center text-4xl mb-4 border-4 border-pink-100 z-10 relative">
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full text-white font-bold flex items-center justify-center text-sm border-2 border-white">
                    {item.step}
                  </div>
                </div>
                <h4 className="font-bold text-lg text-gray-800">{item.title}</h4>
                {item.step !== 4 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-1 border-t-4 border-dashed border-pink-200 -z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-pink-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Pilih Paket Kesukaanmu 🎀
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Mulai dari yang hemat sampai yang puas-puasin!</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Single Cute', price: '15.000', photos: 1, popular: false },
              { name: 'Bestie Pack', price: '45.000', photos: 3, popular: true },
              { name: 'Party Time', price: '70.000', photos: 5, popular: false },
              { name: 'Unlimited Fun', price: '120.000', photos: 10, popular: false },
            ].map((plan, idx) => (
              <Card key={idx} variant={plan.popular ? 'highlighted' : 'default'} className="relative overflow-hidden text-left flex flex-col">
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Paling Laris!
                  </div>
                )}
                <h3 className="font-bold text-xl mb-2 text-gray-800">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-sm font-bold text-gray-500">Rp</span>
                  <span className="text-3xl font-black text-primary ml-1">{plan.price}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center text-gray-600 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    {plan.photos} Sesi Foto
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    Semua Template
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    Download Hi-Res
                  </li>
                </ul>
                <Link href="/pricing" className="w-full mt-auto">
                  <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">
                    Pilih Paket
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
