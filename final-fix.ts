import * as fs from 'fs'

// 1. Fix admin/templates/page.tsx
const adminFile = 'src/app/admin/templates/page.tsx'
let adminContent = fs.readFileSync(adminFile, 'utf8')
if (!adminContent.includes('import { LayoutEditorModal }')) {
  adminContent = adminContent.replace(
    "import React,",
    "import React,\nimport { LayoutEditorModal } from '@/components/admin/LayoutEditorModal'\nimport { Layout } from 'lucide-react'\n"
  )
}
fs.writeFileSync(adminFile, adminContent)

// 2. Fix booth/page.tsx
const boothFile = 'src/app/booth/page.tsx'
let boothContent = fs.readFileSync(boothFile, 'utf8')
// Add layoutConfig state
if (!boothContent.includes('const [layoutConfig, setLayoutConfig]')) {
  boothContent = boothContent.replace(
    'const [templateName, setTemplateName] = useState("")',
    'const [templateName, setTemplateName] = useState("")\n  const [layoutConfig, setLayoutConfig] = useState<any>(null)'
  )
}
// Set it in useEffect
boothContent = boothContent.replace(
  'setTemplateName(template.name)',
  'setTemplateName(template.name)\n            if (template.config) setLayoutConfig(JSON.parse(template.config))'
)
// Clean up the invalid layoutConfig we injected earlier outside
boothContent = boothContent.replace(
  'const layoutConfig = template?.config ? JSON.parse(template.config) : null\n',
  ''
)
fs.writeFileSync(boothFile, boothContent)

