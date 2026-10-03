import * as fs from 'fs'

// 1. Fix admin/templates/page.tsx
const adminFile = 'src/app/admin/templates/page.tsx'
let adminContent = fs.readFileSync(adminFile, 'utf8')
if (!adminContent.includes('import { LayoutEditorModal }')) {
  adminContent = adminContent.replace(
    "import { Plus, Trash2, Image as ImageIcon, Edit2 }",
    "import { Plus, Trash2, Image as ImageIcon, Edit2, Layout } from 'lucide-react'\nimport { LayoutEditorModal } from '@/components/admin/LayoutEditorModal'"
  )
}
adminContent = adminContent.replace('onSave={async (configStr) => {', 'onSave={async (configStr: string) => {')
adminContent = adminContent.replace('layoutTemplate.mode ||', '(layoutTemplate as any).mode ||')
fs.writeFileSync(adminFile, adminContent)

// 2. Fix api/admin/templates/route.ts
const apiFile = 'src/app/api/admin/templates/route.ts'
let apiContent = fs.readFileSync(apiFile, 'utf8')
if (!apiContent.includes('const config = formData.get("config")')) {
  apiContent = apiContent.replace(
    /const mode = \(formData.get\("mode"\) as string\) \|\| "single"/g,
    'const mode = (formData.get("mode") as string) || "single"\n  const config = formData.get("config") as string | null'
  )
}
// Fix line 92 (POST shorthand)
apiContent = apiContent.replace(
  'thumbnailUrl: thumbnailUrl,\n        config,',
  'thumbnailUrl: thumbnailUrl,\n        config: config || undefined,'
)
// Fix line 213 (PUT update)
apiContent = apiContent.replace(
  'if (config !== null) dataToUpdate.config = config',
  'if (typeof config !== "undefined") dataToUpdate.config = config'
)
fs.writeFileSync(apiFile, apiContent)

// 3. Fix booth/page.tsx
const boothFile = 'src/app/booth/page.tsx'
let boothContent = fs.readFileSync(boothFile, 'utf8')
// I injected layoutConfig near countdown, but maybe it's out of scope?
// Let's move it to where template is defined!
boothContent = boothContent.replace(
  "const [countdown, setCountdown] = useState<number | null>(null)\n  const layoutConfig = template?.config ? JSON.parse(template.config) : null",
  "const [countdown, setCountdown] = useState<number | null>(null)"
)
boothContent = boothContent.replace(
  'const template = templates.find((t: any) => t.id === templateId)',
  'const template = templates.find((t: any) => t.id === templateId)\n  const layoutConfig = template?.config ? JSON.parse(template.config) : null'
)
fs.writeFileSync(boothFile, boothContent)
