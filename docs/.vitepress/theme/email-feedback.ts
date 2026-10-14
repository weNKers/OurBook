import type { Router } from 'vitepress'
import { nextTick } from 'vue'
import { FEEDBACK_EMAIL } from '../feedback'

let mountTimer: number | undefined
let mountToken = 0

function mountPageFeedback (path: string) {
  const page = document.querySelector<HTMLElement>('.VPDoc')
  if (!page || path !== window.location.pathname) return

  page.querySelectorAll('.page-email-feedback').forEach((element) => element.remove())
  if (path.startsWith('/feedback/')) return

  const section = document.createElement('section')
  section.className = 'page-email-feedback'
  section.setAttribute('aria-labelledby', 'page-email-feedback-title')

  const heading = document.createElement('h2')
  heading.id = 'page-email-feedback-title'
  heading.textContent = '页面反馈'

  const message = document.createElement('p')
  message.textContent = '发现内容或排版问题？可以邮件告诉我们。'

  const link = document.createElement('a')
  link.textContent = '发送邮件反馈'
  const query = new URLSearchParams({
    subject: `[页面反馈] ${document.title}`,
    body: `反馈页面：${window.location.href}\n\n请在此输入反馈内容。`
  })
  link.href = `mailto:${FEEDBACK_EMAIL}?${query}`

  const footer = page.querySelector('.VPDocFooter')
  if (footer?.parentElement) footer.parentElement.insertBefore(section, footer)
  else page.appendChild(section)
  section.append(heading, message, link)
}

function scheduleFeedbackMount () {
  const path = window.location.pathname
  const token = ++mountToken
  window.clearTimeout(mountTimer)

  const mount = () => {
    if (token !== mountToken) return
    if (document.querySelector('.VPDoc')) {
      mountPageFeedback(path)
      return
    }
    mountTimer = window.setTimeout(mount, 50)
  }

  mountTimer = window.setTimeout(mount, 0)
}

export function installEmailFeedback (router: Router) {
  if (typeof window === 'undefined') return

  const previousAfterRouteChange = router.onAfterRouteChange
  router.onAfterRouteChange = async (to) => {
    await previousAfterRouteChange?.(to)
    await nextTick()
    scheduleFeedbackMount()
  }

  scheduleFeedbackMount()
}
