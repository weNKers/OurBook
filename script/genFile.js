const fs = require('node:fs')
const path = require('node:path')

const docs = path.resolve(__dirname, '../docs')
const directory = require('../docs/.vitepress/university-directory.json')
const emptyTemplate = (title) => `---\ntitle: "${title}"\ndescription: "${title}页面正在整理中。"\ncontentType: university\n---\n\n# ${title}\n\n页面正在迁移中，还请等待迁移完成后查看。\n`

for (const school of directory.schools) {
  const schoolDir = path.join(docs, 'universities', school.region, school.city, school.school)
  const indexFile = path.join(schoolDir, 'index.md')
  fs.mkdirSync(schoolDir, { recursive: true })
  if (!fs.existsSync(indexFile)) fs.writeFileSync(indexFile, emptyTemplate(school.schoolTitle))
}
