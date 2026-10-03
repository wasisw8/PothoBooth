'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, LayoutTemplate, Layers, Loader2 } from 'lucide-react'

interface Template {
  id: string
  name: string
  category: string
  previewUrl: string
  imageUrl?: string
  thumbnailUrl?: string | null
  mode?: string
}

const CATEGORIES = ['Semua', '🐱 Cute', '😂 Funny', '✨ Elegant', '🎄 Seasonal', '🎉 Party', '🌸 Aesthetic']

export default function TemplatesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState<Template[]>([])
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [mode, setMode] = useState<'single' | 'strip' | 'grid6'>('single')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    // Check session
    fetch('/api/session/active')
      .then(res => res.json())
      .then(data => {
        if (!data.hasActiveSession) {
          router.push('/pricing')
        } else {
          setTimeLeft(data.remainingMinutes * 60)
          fetchTemplates()
        }
      })
      .catch(() => router.push('/pricing'))
  }, [router])

  useEffect(() => {
    if (timeLeft === null) return
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const fetchTemplates = () => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const filteredTemplates = templates.filter(t => {
    const matchCategory = activeCategory === 'Semua' || t.category === activeCategory;
    const matchMode = (t.mode || 'single') === mode;
    return matchCategory && matchMode;
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B9D]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Pilih Template Kamu 🎨</h1>
          {timeLeft !== null && (
            <div className="flex items-center gap-2 bg-[#FFF5F7] px-4 py-2 rounded-full text-[#FF6B9D] font-medium border border-[#FF6B9D]/20">
              <Clock className="w-4 h-4" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm inline-flex border border-gray-100">
            <button
              onClick={() => setMode('single')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${
                mode === 'single' ? 'bg-[#FF6B9D] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <LayoutTemplate className="w-5 h-5" />
              Single Photo
            </button>
            <button
              onClick={() => setMode('strip')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${
                mode === 'strip' ? 'bg-[#C084FC] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Layers className="w-5 h-5" />
              Photo Strip
            </button>
            <button
              onClick={() => setMode('grid6' as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${
                mode === 'grid6' ? 'bg-[#FCD34D] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <LayoutTemplate className="w-5 h-5" />
              Grid (6 Foto)
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-gray-800 text-white shadow-md scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTemplates.map(template => (
              <div 
                key={template.id}
                onClick={() => router.push(`/booth?templateId=${template.id}&mode=${mode}`)}
                className="group relative bg-white rounded-3xl p-3 pb-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:border-[#FF6B9D]/30 transition-all hover:-translate-y-1"
              >
                <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-3 overflow-hidden relative">
                  {/* Checkerboard pattern for transparency visualization */}
                  <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]" />
                  <img 
                    src={template.thumbnailUrl || template.imageUrl} 
                    alt={template.name}
                    className="w-full h-full object-contain relative z-10"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
                    <span className="bg-white text-gray-900 font-bold px-6 py-2.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Gunakan ✨
                    </span>
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-800 text-center truncate px-2">{template.name}</h3>
                <p className="text-xs text-gray-500 text-center mt-1">{template.category}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🙈</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada template</h3>
            <p className="text-gray-500">Kategori ini masih kosong, coba pilih yang lain ya!</p>
          </div>
        )}
      </main>
    </div>
  )
}
