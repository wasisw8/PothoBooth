'use client'

import React, { useEffect, useState } from 'react'
import { Download, X, Calendar, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react'

interface Photo {
  id: string
  url: string
  createdAt: string
  templateName: string
  filterUsed: string
  sessionId: string
}

interface GroupedPhotos {
  [sessionId: string]: Photo[]
}

export default function HistoryPage() {
  const [loading, setLoading] = useState(true)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch(`/api/photos?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setPhotos(data.photos || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [page])

  const groupedPhotos = photos.reduce((acc: GroupedPhotos, photo) => {
    if (!acc[photo.sessionId]) {
      acc[photo.sessionId] = []
    }
    acc[photo.sessionId].push(photo)
    return acc
  }, {})

  const handleDownload = async (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pothobooth-${photo.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download failed', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B9D]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] pb-12">
      <header className="bg-white shadow-sm sticky top-0 z-10 mb-8">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-bold text-gray-800">Riwayat Foto Kamu 📜</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        {Object.keys(groupedPhotos).length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada foto</h3>
            <p className="text-gray-500">Yuk mulai sesi fotomu sekarang!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedPhotos).map(([sessionId, sessionPhotos]) => (
              <div key={sessionId} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6 text-gray-500 border-b border-gray-100 pb-4">
                  <Calendar className="w-5 h-5 text-[#C084FC]" />
                  <span className="font-medium">
                    Sesi: {new Date(sessionPhotos[0].createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {sessionPhotos.map(photo => (
                    <div 
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={photo.url} 
                        alt="Photo"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <div className="text-white text-xs mb-2 space-y-1">
                          <p className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {photo.templateName}</p>
                        </div>
                        <button
                          onClick={(e) => handleDownload(photo, e)}
                          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" /> Simpan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Full Size Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-h-[90vh] max-w-4xl" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedPhoto.url} 
              alt="Full size"
              className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl"
            />
            
            <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={(e) => handleDownload(selectedPhoto, e)}
                className="bg-[#FF6B9D] hover:bg-[#FF6B9D]/90 text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-lg transition-transform hover:scale-105"
              >
                <Download className="w-5 h-5" /> Download Resolusi Tinggi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
