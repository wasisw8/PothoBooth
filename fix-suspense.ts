import * as fs from 'fs'

const file = 'src/app/booth/page.tsx'
let content = fs.readFileSync(file, 'utf8')

// The component is exported as default function BoothPage
// I will rename the current component to BoothContent, and export default function BoothPage wrapped in Suspense

content = content.replace('export default function BoothPage() {', 'function BoothContent() {')

content += `\n
import { Suspense } from 'react'

export default function BoothPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center"><div className="animate-bounce-soft text-4xl">📸</div></div>}>
      <BoothContent />
    </Suspense>
  )
}
`

fs.writeFileSync(file, content)
