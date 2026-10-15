import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import EmailFeedback from './EmailFeedback.vue'
import HomeHighlights from './HomeHighlights.vue'
import HomeSearch from './HomeSearch.vue'
import UniversityBreadcrumbs from './UniversityBreadcrumbs.vue'
import './custom.scss'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'home-hero-info-after': () => h(HomeSearch),
    'home-features-after': () => h(HomeHighlights),
    'doc-before': () => h(UniversityBreadcrumbs),
    'layout-bottom': () => h(EmailFeedback)
  })
}
