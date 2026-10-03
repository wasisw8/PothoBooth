import * as fs from 'fs'

const file = 'src/app/admin/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

// Add thumbnail state
content = content.replace(
  "const [file, setFile] = useState<File | null>(null)",
  "const [file, setFile] = useState<File | null>(null)\n  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)"
)

// Add to FormData
content = content.replace(
  "formData.append('file', file)",
  "formData.append('file', file)\n      if (thumbnailFile) formData.append('thumbnail', thumbnailFile)"
)

// Add Thumbnail Input UI
const fileInputs = `
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Template Utama (Transparan)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                  <input
                    type="file"
                    accept="image/png, image/svg+xml, image/jpeg, image/webp"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  {file ? (
                    <span className="text-primary font-medium">{file.name}</span>
                  ) : (
                    <span className="text-gray-500">Klik atau seret file template transparan ke sini</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Thumbnail Cover (Solid/Bebas) - Opsional</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                  <input
                    type="file"
                    accept="image/png, image/svg+xml, image/jpeg, image/webp"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {thumbnailFile ? (
                    <span className="text-primary font-medium">{thumbnailFile.name}</span>
                  ) : (
                    <span className="text-gray-500">Klik untuk memilih gambar cover pratinjau</span>
                  )}
                </div>
              </div>
`
content = content.replace(
  /<div className="border-2 border-dashed[\s\S]*?<\/div>\s*<\/div>/,
  fileInputs
)

// Change the card image display to use thumbnail
content = content.replace(
  '<img src={template.imageUrl}',
  '<img src={template.thumbnailUrl || template.imageUrl}'
)

// Remove checkerboard if we have a thumbnail
content = content.replace(
  /className="aspect-\[3\/4\] bg-gray-100 rounded-t-2xl relative overflow-hidden"/g,
  'className="aspect-[3/4] bg-gray-100 rounded-t-2xl relative overflow-hidden group"'
)
content = content.replace(
  /<div className="absolute inset-0 opacity-10 bg-\[url\('data:image\/svg\+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI\+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8\+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4='\)]" \/>/g,
  '{!template.thumbnailUrl && <div className="absolute inset-0 opacity-10 bg-[url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=\')]" />}'
)

fs.writeFileSync(file, content)
