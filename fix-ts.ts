import * as fs from 'fs'

const file = 'src/app/admin/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

// Fix interface
content = content.replace(
  'imageUrl: string',
  'imageUrl: string\n  thumbnailUrl?: string | null\n  mode?: string'
)

// Fix setEditId missing (if the previous replace failed)
if (!content.includes('const [editId, setEditId]')) {
  content = content.replace(
    'const [isUploading, setIsUploading] = useState(false)',
    'const [isUploading, setIsUploading] = useState(false)\n  const [editId, setEditId] = useState<string | null>(null)'
  )
}

// Fix 'template is not defined' at line 205
// Wait, line 205 is probably `{!template.thumbnailUrl && <div ... />}` but it is inside the form modal, where `template` is not in scope!
// Ah! In the modal, I used `{!template.thumbnailUrl}` instead of something else?
// Wait! The checkerboard replacement was done globally in `patch-admin-ui-thumb.ts`:
// `content = content.replace(/.../, '{!template.thumbnailUrl && ...}')`
// BUT there is a checkerboard in the modal too! For the upload preview!
// Let's change `{!template.thumbnailUrl}` back to just `{true && ...}` or find exactly where it broke.
content = content.replace(
  /\{!template\.thumbnailUrl && <div className="absolute inset-0 opacity-10 bg-\[url\('data:image\/svg\+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI\+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8\+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4='\)]" \/>\}/g,
  '<div className="absolute inset-0 opacity-10 bg-[url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=\')]" />'
)

// Now, ONLY replace the checkerboard inside the card mapping!
// Actually, it's fine if the checkerboard is always there behind the thumbnail! The thumbnail will just cover it if it's opaque!
// So let's just revert the checkerboard logic to always show.

fs.writeFileSync(file, content)

// Also fix interface in templates/page.tsx
const userFile = 'src/app/templates/page.tsx'
let userContent = fs.readFileSync(userFile, 'utf8')
userContent = userContent.replace(
  'imageUrl: string',
  'imageUrl: string\n  thumbnailUrl?: string | null\n  mode?: string'
)
userContent = userContent.replace(
  /\{!template\.thumbnailUrl && <div className="absolute inset-0 opacity-10 bg-\[url\('data:image\/svg\+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI\+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8\+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4='\)]" \/>\}/g,
  '<div className="absolute inset-0 opacity-10 bg-[url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=\')]" />'
)
fs.writeFileSync(userFile, userContent)

