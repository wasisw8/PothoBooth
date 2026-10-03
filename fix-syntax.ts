import * as fs from 'fs'

const adminFile = 'src/app/admin/templates/page.tsx'
let adminContent = fs.readFileSync(adminFile, 'utf8')
// Fix the broken import statement completely
adminContent = adminContent.replace(
  /import React\nimport \{ LayoutEditorModal \} from '@\/components\/admin\/LayoutEditorModal'\nimport \{ Layout \} from 'lucide-react'\n \{ useEffect, useState, useRef \} from 'react'/,
  "import React, { useEffect, useState, useRef } from 'react'\nimport { LayoutEditorModal } from '@/components/admin/LayoutEditorModal'\nimport { Layout } from 'lucide-react'"
)
fs.writeFileSync(adminFile, adminContent)
