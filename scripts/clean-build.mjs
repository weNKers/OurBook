import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

for (const target of ['dist', 'docs/.vitepress/cache']) {
  fs.rmSync(path.join(root, target), { recursive: true, force: true })
}
