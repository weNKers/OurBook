import type { Router } from 'vitepress'
import { nextTick } from 'vue'

const CUSDIS_SCRIPT = 'https://cusdis.com/js/cusdis.es.js'
const CUSDIS_APP_ID = 'bd74da9f-6f05-4c3c-bcf1-cb677d122c75'
const CUSDIS_MIN_HEIGHT = 320

let mountTimer: number | undefined
let mountToken = 0
let cusdisFrame: HTMLIFrameElement | undefined
let cusdisScriptStarted = false
let frameProbe: number | undefined

function resizeCusdisFrame (event: MessageEvent) {
  if (event.origin !== 'https://cusdis.com') return

  const iframe = document.querySelector<HTMLIFrameElement>('#cusdis_thread iframe')
  if (!iframe || event.source !== iframe.contentWindow) return

  const payload = event.data
  const heightValue = typeof payload === 'number'
    ? payload
    : payload?.height ?? payload?.offsetHeight ?? payload?.data?.height
  const height = Number(heightValue)
  if (!Number.isFinite(height) || height <= 0 || height > 4000) return
  iframe.style.height = `${Math.max(CUSDIS_MIN_HEIGHT, Math.ceil(height + 16))}px`
}

function updateCusdisFrame (frame: HTMLIFrameElement, path: string) {
  const source = frame.srcdoc
  const marker = 'window.__DATA__ = '
  const start = source.indexOf(marker)
  const end = start >= 0 ? source.indexOf('\n', start) : -1

  if (start >= 0 && end >= 0) {
    const data = JSON.stringify({
      host: 'https://cusdis.com',
      appId: CUSDIS_APP_ID,
      pageId: path,
      pageUrl: window.location.href,
      pageTitle: document.title
    })
    frame.srcdoc = `${source.slice(0, start)}${marker}${data}${source.slice(end)}`
  }

  frame.style.height = `${CUSDIS_MIN_HEIGHT}px`
}

function captureCusdisFrame (threadBody: HTMLElement, path: string) {
  window.clearInterval(frameProbe)
  const probe = window.setInterval(() => {
    const frame = threadBody.querySelector<HTMLIFrameElement>('iframe')
    if (!frame) return

    window.clearInterval(probe)
    cusdisFrame = frame
    updateCusdisFrame(frame, path)
  }, 100)
  frameProbe = probe

  window.setTimeout(() => {
    window.clearInterval(probe)
    if (!threadBody.querySelector('iframe')) {
      threadBody.innerHTML = '<p class="cusdis-comments__fallback">评论服务暂时无法加载，请稍后刷新页面再试。</p>'
    }
  }, 10000)
}

function mountCusdis (path: string) {
  const page = document.querySelector<HTMLElement>('.VPDoc')
  if (!page || path !== window.location.pathname) return

  page.querySelectorAll('img').forEach((image) => {
    image.decoding = 'async'
    image.loading = 'lazy'
  })

  const reusableFrame = cusdisFrame || document.querySelector<HTMLIFrameElement>('.cusdis-comments iframe')
  page.querySelectorAll('.cusdis-comments').forEach((embed) => embed.remove())

  const thread = document.createElement('section')
  thread.className = 'cusdis-comments'
  thread.setAttribute('aria-labelledby', 'cusdis-comments-title')
  thread.innerHTML = `
    <h2 id="cusdis-comments-title">评论</h2>
    <p class="cusdis-comments__notice">欢迎留下你的想法。评论由 Cusdis 托管，提交后需要审核才会公开显示。</p>
    <div id="cusdis_thread" class="cusdis-comments__thread"></div>`

  const threadBody = thread.querySelector<HTMLElement>('#cusdis_thread')!
  threadBody.dataset.host = 'https://cusdis.com'
  threadBody.dataset.appId = CUSDIS_APP_ID
  threadBody.dataset.pageId = window.location.pathname
  threadBody.dataset.pageUrl = window.location.href
  threadBody.dataset.pageTitle = document.title

  const footer = page.querySelector('.VPDocFooter')
  if (footer?.parentElement) footer.parentElement.insertBefore(thread, footer)
  else page.appendChild(thread)

  if (reusableFrame) {
    cusdisFrame = reusableFrame
    threadBody.appendChild(reusableFrame)
    updateCusdisFrame(reusableFrame, path)
  } else if (!cusdisScriptStarted) {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = CUSDIS_SCRIPT
    cusdisScriptStarted = true
    threadBody.appendChild(script)
    captureCusdisFrame(threadBody, path)
  } else {
    captureCusdisFrame(threadBody, path)
  }
}

function scheduleCusdisMount () {
  const path = window.location.pathname
  const token = ++mountToken
  window.clearTimeout(mountTimer)
  let attempts = 0

  const tryMount = () => {
    if (token !== mountToken) return
    const page = document.querySelector('.VPDoc')
    if (page) {
      mountCusdis(path)
      return
    }
    if (attempts++ < 20) mountTimer = window.setTimeout(tryMount, 50)
  }

  mountTimer = window.setTimeout(tryMount, 0)
}

export function installCusdis (router: Router) {
  if (typeof window === 'undefined') return

  window.addEventListener('message', resizeCusdisFrame)

  const previousAfterRouteChange = router.onAfterRouteChange
  router.onAfterRouteChange = async (to) => {
    await previousAfterRouteChange?.(to)
    await nextTick()
    scheduleCusdisMount()
  }

  scheduleCusdisMount()
}
