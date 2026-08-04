import { defineClientConfig } from 'vuepress/client'
import { defineSearchConfig } from '@vuepress/plugin-slimsearch/client'

defineSearchConfig({
  resultsFilter: (results) => results
    .slice(0, 20)
    .map((result) => ({
      ...result,
      contents: result.contents.slice(0, 3)
    }))
})

export default defineClientConfig({})
