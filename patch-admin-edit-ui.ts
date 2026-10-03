import * as fs from 'fs'

const file = 'src/app/admin/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

// Add EditId state and Pencil icon
if (!content.includes('Edit2')) {
  content = content.replace("import { Plus, Trash2, Image as ImageIcon }", "import { Plus, Trash2, Image as ImageIcon, Edit2 }")
  content = content.replace(
    "const [isUploading, setIsUploading] = useState(false)",
    "const [isUploading, setIsUploading] = useState(false)\n  const [editId, setEditId] = useState<string | null>(null)"
  )
}

// Update handleSubmit
const newHandleSubmit = `
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editId && !file) return
    setIsUploading(true)

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
    } catch {
      alert('Terjadi kesalahan')
    } finally {
      setIsUploading(false)
    }
  }
`
content = content.replace(
  /const handleSubmit = async \([\s\S]*?setIsUploading\(false\)\n    }\n  }/,
  newHandleSubmit.trim()
)

// Update input to not be required in edit mode
content = content.replace(
  'className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"\n                    required',
  'className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"\n                    required={!editId}'
)

// Add Edit button to template card
const editBtn = `
                <div className="absolute top-2 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditId(template.id)
                      setName(template.name)
                      setCategory(template.category)
                      setMode(template.mode || 'single')
                      setFile(null)
                      setThumbnailFile(null)
                      setShowModal(true)
                    }}
                    className="p-2 bg-white text-blue-500 rounded-lg hover:bg-blue-50 shadow-sm"
                    title="Edit Template"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
`
content = content.replace(
  /<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">\s*<button\s*onClick={\(\) => handleDelete\(template\.id\)}/,
  editBtn
)

// Reset editId when opening modal for NEW
content = content.replace(
  "onClick={() => setShowModal(true)}",
  "onClick={() => { setEditId(null); setName(''); setCategory('Cute'); setMode('single'); setFile(null); setThumbnailFile(null); setShowModal(true); }}"
)

// Add Edit Title to Modal
content = content.replace(
  '<h3 className="font-bold text-lg">Tambah Template Baru</h3>',
  '<h3 className="font-bold text-lg">{editId ? "Edit Template" : "Tambah Template Baru"}</h3>'
)

// Fix file display in Edit Mode
content = content.replace(
  /<span className="text-gray-500">Klik atau seret file template transparan ke sini<\/span>/,
  '{editId ? <span className="text-gray-500">Klik untuk mengganti template (Kosongkan jika tidak ingin mengubah)</span> : <span className="text-gray-500">Klik atau seret file template transparan ke sini</span>}'
)

fs.writeFileSync(file, content)
