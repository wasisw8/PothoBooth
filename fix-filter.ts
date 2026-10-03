import * as fs from 'fs'

const file = 'src/app/templates/page.tsx'
let content = fs.readFileSync(file, 'utf8')

const oldFilter = `  const filteredTemplates = activeCategory === 'Semua' \n    ? templates \n    : templates.filter(t => t.category === activeCategory)`

const newFilter = `  const filteredTemplates = templates.filter(t => {
    const matchCategory = activeCategory === 'Semua' || t.category === activeCategory;
    const matchMode = (t.mode || 'single') === mode;
    return matchCategory && matchMode;
  })`

content = content.replace(oldFilter, newFilter)
fs.writeFileSync(file, content)
