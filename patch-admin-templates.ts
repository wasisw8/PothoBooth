import * as fs from 'fs'

const file = 'src/app/admin/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

// Add mode to state
content = content.replace(
  "const [name, setName] = useState('')",
  "const [name, setName] = useState('')\n  const [mode, setMode] = useState('single')"
)

// Add mode to FormData
content = content.replace(
  "formData.append('category', category)",
  "formData.append('category', category)\n      formData.append('mode', mode)"
)

// Add mode select to the form modal
const selectHTML = `
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Cute">Cute</option>
                  <option value="Funny">Funny</option>
                  <option value="Elegant">Elegant</option>
                  <option value="Seasonal">Seasonal</option>
                  <option value="Party">Party</option>
                  <option value="Aesthetic">Aesthetic</option>
                </select>
              </div>

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
`
content = content.replace(
  /<div>\s*<label className="block text-sm font-medium text-gray-700 mb-1">Kategori<\/label>[\s\S]*?<\/select>\s*<\/div>/,
  selectHTML
)

// Add mode badge to the template card display
const cardLabelHTML = `
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={\`px-2 py-1 rounded-full text-xs font-bold shadow-sm \${template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}\`}>
                    {template.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                  <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                    {template.mode === 'grid6' ? 'Grid 6' : template.mode === 'strip' ? 'Strip' : 'Single'}
                  </span>
                </div>
`
content = content.replace(
  /<div className="absolute top-2 left-2">[\s\S]*?<\/div>/,
  cardLabelHTML
)

fs.writeFileSync(file, content)
