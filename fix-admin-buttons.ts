import * as fs from 'fs'

const file = 'src/app/admin/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

const buttonsHtml = `
            <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
              <button
                onClick={() => {
                  setEditId(template.id)
                  setName(template.name)
                  setCategory(template.category)
                  setMode((template as any).mode || 'single')
                  setFile(null)
                  setThumbnailFile(null)
                  setShowModal(true)
                }}
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
            
            <img
`

content = content.replace(
  /<img\n                src=\{template\.thumbnailUrl \|\| template\.imageUrl\}/,
  buttonsHtml + '                src={template.thumbnailUrl || template.imageUrl}'
)

fs.writeFileSync(file, content)
