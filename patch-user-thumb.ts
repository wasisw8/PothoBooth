import * as fs from 'fs'

const file = 'src/app/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

content = content.replace(
  '<img\n                src={template.imageUrl}',
  '<img\n                src={template.thumbnailUrl || template.imageUrl}'
)

content = content.replace(
  /<div className="absolute inset-0 opacity-10 bg-\[url\('data:image\/svg\+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI\+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8\+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4='\)]" \/>/g,
  '{!template.thumbnailUrl && <div className="absolute inset-0 opacity-10 bg-[url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=\')]" />}'
)

fs.writeFileSync(file, content)
