"use client";

import { Download, X, Trash2, MousePointerClick } from 'lucide-react'

interface PhotoPreviewProps {
  imageData: string
  mode: string
  onSave: () => void
  onDiscard: () => void
  onClose: () => void
  onRetakeSlot?: (index: number) => void
  saving: boolean
}

export function PhotoPreview({ imageData, mode, onSave, onDiscard, onClose, onRetakeSlot, saving }: PhotoPreviewProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageData
    link.download = `pothobooth_${Date.now()}.png`
    link.click()
  }

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (mode !== 'grid6' || !onRetakeSlot) return

    const rect = e.currentTarget.getBoundingClientRect()
    // Calculate click coordinates relative to the 682x1024 base image
    const scaleX = 682 / rect.width
    const scaleY = 1024 / rect.height
    
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    // Determine column (0 or 1) based on center split
    const col = x < 341 ? 0 : 1
    
    // Determine row (0, 1, or 2)
    let row = -1
    if (y >= 90 && y <= 320) row = 0
    else if (y >= 340 && y <= 570) row = 1
    else if (y >= 590 && y <= 820) row = 2
    
    if (row !== -1) {
      const index = row * 2 + col
      onRetakeSlot(index)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100">
          <h3 className="font-bold text-lg">✨ Hasil Foto</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo */}
        <div className="p-4 relative">
          {mode === 'grid6' && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 pointer-events-none z-10 animate-bounce-soft">
              <MousePointerClick className="w-4 h-4" /> Klik foto yang ingin diulang
            </div>
          )}
          <img
            src={imageData}
            alt="Captured photo"
            onClick={handleImageClick}
            className={`w-full rounded-2xl shadow-lg ${mode === 'grid6' ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''}`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-pink-100">
          <button
            onClick={onDiscard}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Buang
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold transition-all"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? (
              <span className="animate-spin">⏳</span>
            ) : (
              '✅'
            )}
            {saving ? 'Saving...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}
