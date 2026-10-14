import DefaultTheme from 'vitepress/theme'
import { installCusdis } from './comments'
import './custom.scss'

export default {
  extends: DefaultTheme,
  enhanceApp ({ router }) {
    installCusdis(router)
  }
}
