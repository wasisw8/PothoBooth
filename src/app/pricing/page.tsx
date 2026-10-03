'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Camera, Sparkles, Crown, Loader2, QrCode } from 'lucide-react'

interface ActiveSession {
  hasActiveSession: boolean
  remainingMinutes?: number
}

interface PaymentModalData {
  qrisImage: string
  total: number
  orderId: string
  expiresAt: string // ISO string
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(amount)
}

const PACKAGES = [
  { key: 'ceria', icon: <Camera className="w-8 h-8 text-[#FF6B9D]" />, name: '🌸 Ceria', price: 10000, duration: '15 menit', desc: 'Cocok buat foto iseng-iseng sendiri' },
  { key: 'seru', icon: <Sparkles className="w-8 h-8 text-[#C084FC]" />, name: '🌈 Seru', price: 15000, duration: '20 menit', desc: 'Lebih banyak waktu buat gaya seru' },
  { key: 'party', icon: <Clock className="w-8 h-8 text-[#FCD34D]" />, name: '🎉 Party', price: 25000, duration: '30 menit', desc: 'Puas foto rame-rame bareng bestie', popular: true },
  { key: 'vip', icon: <Crown className="w-8 h-8 text-[#FF6B9D]" />, name: '🎪 VIP', price: 50000, duration: '1 jam', desc: 'Bebas gaya sepuasnya tanpa buru-buru' }
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [buyingKey, setBuyingKey] = useState<string | null>(null)
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentModalData | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    fetch('/api/session/active')
      .then(res => res.json())
      .then(data => {
        setActiveSession(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (paymentData) {
      interval = setInterval(() => {
        fetch(`/api/payment/status?orderId=${paymentData.orderId}`)
          .then(res => res.json())
          .then(data => {
            if (data.status === 'PAID') {
              router.push('/templates')
            }
          })
          .catch(console.error)

        const expires = new Date(paymentData.expiresAt).getTime()
        const now = new Date().getTime()
        const diff = Math.max(0, Math.floor((expires - now) / 1000))
        setTimeLeft(diff)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [paymentData, router])

  // Timer update for UI every second
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (paymentData) {
      interval = setInterval(() => {
        const expires = new Date(paymentData.expiresAt).getTime()
        const now = new Date().getTime()
        const diff = Math.max(0, Math.floor((expires - now) / 1000))
        setTimeLeft(diff)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [paymentData])

  const handleBuy = async (packageKey: string) => {
    setBuyingKey(packageKey)
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageKey })
      })
      const data = await res.json()
      
      if (data.error) {
        alert("Error: " + data.error)
        setBuyingKey(null)
        return
      }

      if (data.bypassed) {
        window.location.href = '/templates'
        return
      }

      if (data.qrisImage) {
        setPaymentData({
          qrisImage: data.qrisImage,
          total: data.total,
          orderId: data.orderId,
          expiresAt: data.expiresAt || new Date(Date.now() + 15 * 60000).toISOString()
        })
      } else {
        alert('Gagal membuat transaksi, mohon coba lagi.')
      }
    } catch (e) {
      console.error(e)
      alert("Gagal menghubungi server")
    }
    setBuyingKey(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B9D]" />
      </div>
    )
  }

  if (activeSession?.hasActiveSession) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border-4 border-[#FF6B9D]/20">
          <Camera className="w-16 h-16 text-[#FF6B9D] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sesi Masih Aktif! 📸</h2>
          <p className="text-gray-600 mb-6">Kamu masih punya sisa waktu {activeSession.remainingMinutes} menit.</p>
          <button
            onClick={() => router.push('/templates')}
            className="w-full bg-[#FF6B9D] hover:bg-[#FF6B9D]/90 text-white font-bold py-3 px-6 rounded-full transition-all hover:scale-105 active:scale-95"
          >
            Lanjut Foto
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-center text-gray-800 mb-4 tracking-tight">
          Pilih Paket Foto Kamu <span className="text-4xl">📦</span>
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
          Mulai dari yang santai sampai yang heboh, pilih paket yang paling cocok buat momen manismu hari ini! ✨
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.key} 
              className={`relative bg-white rounded-3xl p-6 shadow-lg border-2 transition-transform hover:-translate-y-2 flex flex-col
                ${pkg.popular ? 'border-[#FCD34D] shadow-[#FCD34D]/20' : 'border-transparent hover:border-[#FF6B9D]/30'}
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FCD34D] text-gray-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Paling Laris 🔥
                </div>
              )}
              
              <div className="bg-[#FFF5F7] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {pkg.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
              <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{pkg.desc}</p>
              
              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-black text-[#FF6B9D]">{formatRupiah(pkg.price)}</span>
                </div>
                <div className="text-gray-500 text-sm font-medium mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 
                  Sesi {pkg.duration}
                </div>
                
                <button
                  onClick={() => handleBuy(pkg.key)}
                  disabled={buyingKey === pkg.key}
                  className={`w-full font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2
                    ${pkg.popular 
                      ? 'bg-[#FF6B9D] hover:bg-[#FF6B9D]/90 text-white shadow-lg shadow-[#FF6B9D]/30' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-2 border-gray-100'}
                    ${buyingKey === pkg.key ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}
                  `}
                >
                  {buyingKey === pkg.key ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
                  ) : 'Bayar Sekarang'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {paymentData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <div className="text-center mb-6">
              <div className="bg-[#FFF5F7] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-[#FF6B9D]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Scan QRIS</h2>
              <p className="text-gray-500 text-sm">Order ID: {paymentData.orderId}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex justify-center">
              <img src={paymentData.qrisImage} alt="QRIS" className="w-48 h-48 rounded-xl object-contain bg-white p-2 shadow-sm" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-500">Total Pembayaran</span>
                <span className="text-xl font-bold text-[#FF6B9D]">{formatRupiah(paymentData.total)}</span>
              </div>
              
              <div className="bg-[#FFF5F7] text-[#FF6B9D] px-4 py-3 rounded-xl flex items-center justify-between font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Sisa Waktu
                </div>
                <span>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <button
                onClick={() => setPaymentData(null)}
                className="w-full py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
