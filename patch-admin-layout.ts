import * as fs from 'fs'

const file = 'src/app/admin/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

// Add imports
content = content.replace(
  "import { Plus, Trash2, Image as ImageIcon, Edit2 }",
  "import { Plus, Trash2, Image as ImageIcon, Edit2, Layout } from 'lucide-react'\nimport { LayoutEditorModal } from '@/components/admin/LayoutEditorModal'"
)

// Add config to Template interface
content = content.replace(
  "mode?: string",
  "mode?: string\n  config?: string | null"
)

// Add state for layout editor
content = content.replace(
  "const [editId, setEditId] = useState<string | null>(null)",
  "const [editId, setEditId] = useState<string | null>(null)\n  const [layoutTemplate, setLayoutTemplate] = useState<Template | null>(null)"
)

// Add layout button to the template card
const layoutBtn = `
                  <button
                    onClick={() => setLayoutTemplate(template)}
                    className="p-2 bg-white text-purple-500 rounded-lg hover:bg-purple-50 shadow-sm"
                    title="Edit Layout Kamera"
                  >
                    <Layout className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
`
content = content.replace(
  /<button\s*onClick={\(\) => {\s*setEditId\(template\.id\)/,
  layoutBtn.trim()
)

// Add LayoutEditorModal to the bottom of the page
const modalRender = `
      {layoutTemplate && (
        <LayoutEditorModal
          template={layoutTemplate}
          onClose={() => setLayoutTemplate(null)}
          onSave={async (configStr) => {
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
`
content = content.replace(
  /<\/div>\s*\)\s*}\s*$/,
  modalRender
)

fs.writeFileSync(file, content)
