import React, { useState } from 'react'
import { X, Save, Copy } from 'lucide-react'

interface BoxConfig {
  x: number
  y: number
  w: number
  h: number
}

interface Props {
  template: any
  onClose: () => void
  onSave: (config: string) => void
}

const DEFAULT_BOXES: BoxConfig[] = [
  {x: 40, y: 90, w: 295, h: 260},
  {x: 350, y: 90, w: 295, h: 260},
  {x: 40, y: 340, w: 295, h: 260},
  {x: 350, y: 340, w: 295, h: 260},
  {x: 40, y: 590, w: 295, h: 260},
  {x: 350, y: 590, w: 295, h: 260}
]

export function LayoutEditorModal({ template, onClose, onSave }: Props) {
  let initialBoxes = DEFAULT_BOXES
  try {
    if (template.config) {
      const parsed = JSON.parse(template.config)
      if (parsed.boxes) initialBoxes = parsed.boxes
    }
  } catch (e) {}

  const [boxes, setBoxes] = useState<BoxConfig[]>(initialBoxes)
  const [selectedBox, setSelectedBox] = useState<number>(0)

  const updateBox = (key: keyof BoxConfig, value: number) => {
    const newBoxes = [...boxes]
    newBoxes[selectedBox] = { ...newBoxes[selectedBox], [key]: value }
    setBoxes(newBoxes)
  }

  const handleSave = () => {
    onSave(JSON.stringify({ boxes }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="font-bold text-lg">Editor Layout: {template.name}</h3>
            <p className="text-sm text-gray-500">Sesuaikan posisi kotak kamera dengan template (Asumsi ukuran kanvas 682x1024)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Preview */}
          <div className="flex-1 bg-gray-100 p-4 overflow-y-auto flex justify-center items-center">
            <div className="relative bg-white shadow-md border" style={{ width: '341px', height: '512px' }}>
              <img src={template.imageUrl} className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none opacity-80" />
              
              {boxes.map((box, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedBox(i)}
                  className={`absolute border-2 cursor-pointer transition-all z-10 flex items-center justify-center text-white font-bold ${selectedBox === i ? 'border-blue-500 bg-blue-500/50 z-30' : 'border-pink-500 bg-pink-500/30'}`}
                  style={{
                    left: `${(box.x / 682) * 100}%`,
                    top: `${(box.y / 1024) * 100}%`,
                    width: `${(box.w / 682) * 100}%`,
                    height: `${(box.h / 1024) * 100}%`,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="w-80 border-l bg-white flex flex-col">
            <div className="p-4 border-b flex gap-2 overflow-x-auto">
              {boxes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedBox(i)}
                  className={`w-10 h-10 rounded-lg font-bold flex-shrink-0 ${selectedBox === i ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-6">
              <h4 className="font-bold text-gray-700">Pengaturan Kotak {selectedBox + 1}</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label className="font-medium text-gray-600">Posisi Kiri (X)</label>
                    <span className="text-gray-400">{boxes[selectedBox].x}px</span>
                  </div>
                  <input type="range" min="0" max="682" value={boxes[selectedBox].x} onChange={(e) => updateBox('x', parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label className="font-medium text-gray-600">Posisi Atas (Y)</label>
                    <span className="text-gray-400">{boxes[selectedBox].y}px</span>
                  </div>
                  <input type="range" min="0" max="1024" value={boxes[selectedBox].y} onChange={(e) => updateBox('y', parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label className="font-medium text-gray-600">Lebar (Width)</label>
                    <span className="text-gray-400">{boxes[selectedBox].w}px</span>
                  </div>
                  <input type="range" min="10" max="682" value={boxes[selectedBox].w} onChange={(e) => updateBox('w', parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label className="font-medium text-gray-600">Tinggi (Height)</label>
                    <span className="text-gray-400">{boxes[selectedBox].h}px</span>
                  </div>
                  <input type="range" min="10" max="1024" value={boxes[selectedBox].h} onChange={(e) => updateBox('h', parseInt(e.target.value))} className="w-full" />
                </div>
              </div>

            </div>

            <div className="p-4 border-t bg-gray-50">
              <button onClick={handleSave} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Simpan Layout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
