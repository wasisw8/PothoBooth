'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CameraView } from '@/components/booth/CameraView'
import { SessionTimer } from '@/components/booth/SessionTimer'
import { PhotoPreview } from '@/components/booth/PhotoPreview'
import { ArrowLeft, Camera, Image, SlidersHorizontal } from 'lucide-react'

const FILTERS = [
  { id: null, name: 'Normal', emoji: '🔲' },
  { id: 'bw', name: 'B&W', emoji: '⬛' },
  { id: 'sepia', name: 'Sepia', emoji: '🟤' },
  { id: 'vintage', name: 'Vintage', emoji: '📜' },
  { id: 'warm', name: 'Warm', emoji: '🔥' },
  { id: 'cool', name: 'Cool', emoji: '❄️' },
  { id: 'vivid', name: 'Vivid', emoji: '🌈' },
  { id: 'fade', name: 'Fade', emoji: '🌫️' },
]

interface ActiveSession {
  transactionId: string
  expiresAt: string
  package: string
}

function BoothContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')
  const urlMode = (searchParams.get('mode') as 'single' | 'strip' | 'grid6') || 'single'

  const [session, setSession] = useState<ActiveSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [mode, setMode] = useState<'single' | 'strip' | 'grid6'>(urlMode)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [retakeSlot, setRetakeSlot] = useState<number | null>(null)
  const [sessionKey, setSessionKey] = useState(0)
  const [templateUrl, setTemplateUrl] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState<string | null>(null)
  const [layoutConfig, setLayoutConfig] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [photoCount, setPhotoCount] = useState(0)

  // Check active session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/session/active')
        const data = await res.json()
        if (data.active) {
          setSession({
            transactionId: data.transactionId,
            expiresAt: data.expiresAt,
            package: data.package,
          })
        } else {
          router.push('/pricing')
        }
      } catch {
        router.push('/pricing')
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [router])

  // Load template details
  useEffect(() => {
    if (templateId) {
      const loadTemplate = async () => {
        try {
          const res = await fetch('/api/templates')
          const data = await res.json()
          const template = data.templates.find((t: { id: string }) => t.id === templateId)
          if (template) {
            setTemplateUrl(template.imageUrl)
            setTemplateName(template.name)
            if (template.config) setLayoutConfig(JSON.parse(template.config))
          }
        } catch {
          console.error('Failed to load template')
        }
      }
      loadTemplate()
    }
  }, [templateId])

  const handleCapture = useCallback((imageData: string) => {
    setCapturedPhoto(imageData)
  }, [])

  const handleSave = async () => {
    if (!capturedPhoto || !session) return
    setSaving(true)
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: capturedPhoto,
          transactionId: session.transactionId,
          templateId: templateId || undefined,
          filter: selectedFilter,
          mode,
        }),
      })
      if (res.ok) {
        setPhotoCount(prev => prev + 1)
        setCapturedPhoto(null)
        setSessionKey(k => k + 1)
      } else {
        alert('Gagal menyimpan foto. Coba lagi!')
      }
    } catch {
      alert('Terjadi kesalahan. Coba lagi!')
    } finally {
      setSaving(false)
    }
  }

  const handleRetake = (index: number) => {
    setRetakeSlot(index)
    setCapturedPhoto(null)
  }

  const handleDiscard = () => {
    setCapturedPhoto(null)
    setRetakeSlot(null)
    setSessionKey(k => k + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="animate-bounce-soft text-4xl">📸</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-pink-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push('/templates')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B9D] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>

          {session && (
            <SessionTimer 
              expiresAt={session.expiresAt} 
              onExpired={() => router.push('/pricing')} 
            />
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-[#FF6B9D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-700">
              <Image className="w-4 h-4 text-[#FF6B9D]" />
              {photoCount} Tersimpan
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 flex flex-col items-center max-w-4xl mx-auto w-full">
        {templateName && (
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-gray-800">Mode: {mode === 'grid6' ? 'Grid 6 Foto' : mode === 'strip' ? 'Photo Strip' : 'Single Photo'}</h2>
            <p className="text-gray-500">Template: {templateName}</p>
          </div>
        )}

        {/* Camera Container */}
        <div className={`w-full transition-all duration-300 ${capturedPhoto ? 'hidden opacity-0 scale-95 pointer-events-none' : 'block opacity-100 scale-100'}`}>
          <CameraView
            key={sessionKey}
            templateUrl={templateUrl}
            filter={selectedFilter}
            onCapture={handleCapture}
            mode={mode}
            retakeSlot={retakeSlot}
            layoutConfig={layoutConfig}
          />
        </div>

        {/* Filters Panel */}
        {showFilters && !capturedPhoto && (
          <div className="mt-8 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 w-full animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#C084FC]" />
              Filter Kamera
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {FILTERS.map(f => (
                <button
                  key={f.id || 'normal'}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl transition-all ${
                    selectedFilter === f.id 
                      ? 'bg-[#FFF5F7] border-2 border-[#FF6B9D] shadow-sm scale-105' 
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-xs font-bold text-gray-700">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {capturedPhoto && (
        <PhotoPreview
          imageData={capturedPhoto}
          mode={mode}
          onSave={handleSave}
          onDiscard={handleDiscard}
          onClose={() => setCapturedPhoto(null)}
          onRetakeSlot={handleRetake}
          saving={saving}
        />
      )}
    </div>
  )
}


import { Suspense } from 'react'

export default function BoothPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center"><div className="animate-bounce-soft text-4xl">📸</div></div>}>
      <BoothContent />
    </Suspense>
  )
}
