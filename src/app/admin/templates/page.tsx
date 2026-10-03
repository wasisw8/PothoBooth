'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, Upload, X, Loader2, Edit2, Layout } from 'lucide-react'
import { LayoutEditorModal } from '@/components/admin/LayoutEditorModal'

interface Template {
  id: string
  name: string
  category: string
  imageUrl: string
  thumbnailUrl?: string | null
  isActive: boolean
  mode?: string
  config?: string | null
}

const CATEGORIES = ["Semua", "Cute", "Funny", "Elegant", "Seasonal", "Party", "Aesthetic"]

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [layoutTemplate, setLayoutTemplate] = useState<Template | null>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  
  const [name, setName] = useState('')
  const [mode, setMode] = useState('single')
  const [category, setCategory] = useState(CATEGORIES[1])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/admin/templates') // Fetching from admin route to bypass frontend filters
      const data = await res.json()
      if (data.templates) setTemplates(data.templates)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selected)
    }
  }

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setThumbnailFile(selected)
      const reader = new FileReader()
      reader.onloadend = () => setThumbPreview(reader.result as string)
      reader.readAsDataURL(selected)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editId && !file) return
    setUploading(true)

    const formData = new FormData()
    if (editId) formData.append('id', editId)
    formData.append('name', name)
    formData.append('category', category)
    formData.append('mode', mode)
    if (file) formData.append('file', file)
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile)

    try {
      const res = await fetch('/api/admin/templates', {
        method: editId ? 'PUT' : 'POST',
        body: formData,
      })
      if (res.ok) {
        setShowModal(false)
        fetchTemplates()
      } else {
        alert('Gagal menyimpan template')
      }
    } catch (error) {
      alert('Terjadi kesalahan saat upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus template ini?')) return
    try {
      const res = await fetch(`/api/admin/templates?id=${id}`, { method: 'DELETE' })
      if (res.ok) fetchTemplates()
    } catch (error) {
      alert('Gagal menghapus')
    }
  }

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !current })
      })
      if (res.ok) fetchTemplates()
    } catch (error) {
      alert('Gagal mengubah status')
    }
  }

  const openNewModal = () => {
    setEditId(null)
    setName('')
    setCategory(CATEGORIES[1])
    setMode('single')
    setFile(null)
    setThumbnailFile(null)
    setPreview(null)
    setThumbPreview(null)
    setShowModal(true)
  }

  const openEditModal = (t: Template) => {
    setEditId(t.id)
    setName(t.name)
    setCategory(t.category)
    setMode(t.mode || 'single')
    setFile(null)
    setThumbnailFile(null)
    setPreview(t.imageUrl)
    setThumbPreview(t.thumbnailUrl || null)
    setShowModal(true)
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading templates...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Template 🎨</h1>
          <p className="text-gray-500">Upload dan atur template frame untuk photobooth</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Template
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            
            <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-4 relative overflow-hidden group">
              {/* Checkerboard background for transparent areas */}
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]" />
              
              <img src={template.thumbnailUrl || template.imageUrl} alt={template.name} className="w-full h-full object-cover relative z-10" />
              
              {!template.isActive && (
                <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">Nonaktif</span>
                </div>
              )}

              {/* Action Buttons Overlay */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 z-30">
                <button
                  onClick={() => openEditModal(template)}
                  className="p-2 bg-white text-blue-500 rounded-full hover:bg-blue-50 shadow-md border border-gray-100 transition-transform hover:scale-110"
                  title="Edit Info Template"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setLayoutTemplate(template)}
                  className="p-2 bg-white text-purple-500 rounded-full hover:bg-purple-50 shadow-md border border-gray-100 transition-transform hover:scale-110"
                  title="Edit Layout Kamera"
                >
                  <Layout className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Badge Overlay */}
              <div className="absolute top-2 left-2 z-30">
                <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm border border-white">
                  {template.mode === 'grid6' ? 'Grid 6' : template.mode === 'strip' ? 'Strip' : 'Single'}
                </span>
              </div>
            </div>
            
            <h3 className="font-bold text-gray-800 truncate mb-1">{template.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{template.category}</p>
            
            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={template.isActive}
                  onChange={() => toggleActive(template.id, template.isActive)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-2 text-xs font-medium text-gray-600">Aktif</span>
              </label>
              
              <button 
                onClick={() => handleDelete(template.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Hapus Template"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{editId ? 'Edit Template' : 'Upload Template Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              
              {/* Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode Template</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="single">Single Photo (1 Foto)</option>
                  <option value="strip">Photo Strip (4 Foto)</option>
                  <option value="grid6">Grid (6 Foto)</option>
                </select>
              </div>

              {/* Main File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Template Utama (Transparan)</label>
                <div 
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".png,.svg,.jpeg,.jpg,.webp" 
                    onChange={handleFileChange}
                  />
                  {preview ? (
                    <div className="relative w-24 mx-auto aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
                      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]" />
                      <img src={preview} alt="Preview" className="w-full h-full object-cover relative z-10" />
                    </div>
                  ) : (
                    <div className="py-2">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{editId ? 'Klik untuk mengganti template (Abaikan jika tidak ingin mengubah)' : 'Klik untuk pilih file'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Thumbnail Cover (Solid/Contoh Foto)</label>
                <div 
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => thumbInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={thumbInputRef} 
                    className="hidden" 
                    accept=".png,.svg,.jpeg,.jpg,.webp" 
                    onChange={handleThumbChange}
                  />
                  {thumbPreview ? (
                    <div className="relative w-24 mx-auto aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
                      <img src={thumbPreview} alt="Preview Thumbnail" className="w-full h-full object-cover relative z-10" />
                    </div>
                  ) : (
                    <div className="py-2">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Klik untuk pilih gambar cover (Opsional)</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Template</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                  placeholder="Misal: Pink Ribbon"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={(!editId && !file) || !name || uploading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...</> : 'Simpan Template'}
              </button>
            </form>
          </div>
        </div>
      )}
    
      {layoutTemplate && (
        <LayoutEditorModal
          template={layoutTemplate}
          onClose={() => setLayoutTemplate(null)}
          onSave={async (configStr: string) => {
            const formData = new FormData()
            formData.append('id', layoutTemplate.id)
            formData.append('name', layoutTemplate.name)
            formData.append('category', layoutTemplate.category)
            formData.append('mode', layoutTemplate.mode || 'single')
            formData.append('config', configStr)
            
            try {
              const res = await fetch('/api/admin/templates', {
                method: 'PUT',
                body: formData
              })
              if (res.ok) {
                setLayoutTemplate(null)
                fetchTemplates()
              }
            } catch (e) {
              alert('Gagal menyimpan layout')
            }
          }}
        />
      )}
    </div>
  )
}
