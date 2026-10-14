import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import EmailFeedback from './EmailFeedback.vue'
import UniversityBreadcrumbs from './UniversityBreadcrumbs.vue'
import './custom.scss'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => h(UniversityBreadcrumbs),
    'layout-bottom': () => h(EmailFeedback)
  })
}
