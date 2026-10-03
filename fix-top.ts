import * as fs from 'fs'

const file = 'src/app/admin/templates/page.tsx'
const content = fs.readFileSync(file, 'utf8')
const lines = content.split('\n')
// Replace first 8 lines
lines.splice(0, 8,
  "'use client'",
  "",
  "import React, { useEffect, useState, useRef } from 'react'",
  "import { LayoutEditorModal } from '@/components/admin/LayoutEditorModal'",
  "import { Layout, Plus, Trash2, Image as ImageIcon, Upload, X, Loader2, Edit2 } from 'lucide-react'"
)
fs.writeFileSync(file, lines.join('\n'))
