import DefaultTheme from 'vitepress/theme'
import { installEmailFeedback } from './email-feedback'
import './custom.scss'

export default {
  extends: DefaultTheme,
  enhanceApp ({ router }) {
    installEmailFeedback(router)
  }
}
