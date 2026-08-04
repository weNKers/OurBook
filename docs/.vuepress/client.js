import { defineClientConfig } from 'vuepress/client'

const CUSDIS_SCRIPT = 'https://cusdis.com/js/cusdis.es.js'
const CUSDIS_APP_ID = 'bd74da9f-6f05-4c3c-bcf1-cb677d122c75'
const CUSDIS_MIN_HEIGHT = 320
let cusdisMountTimer
let cusdisMountToken = 0
let cusdisFrame
let cusdisScriptStarted = false
let cusdisFrameProbe

function resizeCusdisFrame (event) {
  if (typeof window === 'undefined' || event.origin !== 'https://cusdis.com') return

  const iframe = document.querySelector('#cusdis_thread iframe')
  if (!iframe || event.source !== iframe.contentWindow) return

  const payload = event.data
  const heightValue = typeof payload === 'number'
    ? payload
    : payload?.height ?? payload?.offsetHeight ?? payload?.data?.height
  const height = Number(heightValue)

  if (!Number.isFinite(height) || height <= 0 || height > 4000) return
  iframe.style.height = `${Math.max(CUSDIS_MIN_HEIGHT, Math.ceil(height + 16))}px`
}

function removeCusdisEmbeds () {
  document.querySelectorAll('.cusdis-comments').forEach((embed) => embed.remove())
}

function updateCusdisFrame (frame, path) {
  const source = frame?.srcdoc
  const marker = 'window.__DATA__ = '
  const start = source?.indexOf(marker)
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

function captureCusdisFrame (threadBody, path) {
  window.clearInterval(cusdisFrameProbe)
  cusdisFrameProbe = window.setInterval(() => {
    const frame = threadBody.querySelector('iframe')
    if (!frame) return

    window.clearInterval(cusdisFrameProbe)
    cusdisFrame = frame
    updateCusdisFrame(frame, path)
  }, 100)

  window.setTimeout(() => window.clearInterval(cusdisFrameProbe), 10000)
}

function mountCusdis (path = window.location.pathname) {
  if (typeof window === 'undefined') return

  const page = document.querySelector('.vp-page')
  if (!page || path !== window.location.pathname) return

  const reusableFrame = cusdisFrame || document.querySelector('.cusdis-comments iframe')
  removeCusdisEmbeds()

  const thread = document.createElement('section')
  thread.className = 'cusdis-comments'
  thread.setAttribute('aria-labelledby', 'cusdis-comments-title')
  thread.innerHTML = `
    <h2 id="cusdis-comments-title">评论</h2>
    <p class="cusdis-comments__notice">欢迎留下你的想法。评论由 Cusdis 托管，提交后需要审核才会公开显示。</p>
    <div id="cusdis_thread" class="cusdis-comments__thread"></div>`

  const threadBody = thread.querySelector('#cusdis_thread')
  threadBody.dataset.host = 'https://cusdis.com'
  threadBody.dataset.appId = CUSDIS_APP_ID
  threadBody.dataset.pageId = window.location.pathname
  threadBody.dataset.pageUrl = window.location.href
  threadBody.dataset.pageTitle = document.title
  threadBody.dataset.cusdisPath = window.location.pathname

  const meta = page.querySelector('.vp-page-meta')
  page.insertBefore(thread, meta || null)

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

function scheduleCusdisMount (waitForPageReplacement = false) {
  if (typeof window === 'undefined') return

  const path = window.location.pathname
  const previousPage = waitForPageReplacement
    ? document.querySelector('.vp-page')
    : null
  const token = ++cusdisMountToken
  window.clearTimeout(cusdisMountTimer)
  let attempts = 0
  const tryMount = () => {
    if (token !== cusdisMountToken) return
    const page = document.querySelector('.vp-page')
    if (page && page !== previousPage) {
      mountCusdis(path)
      return
    }
    if (attempts++ < 20) {
      cusdisMountTimer = window.setTimeout(tryMount, 50)
    }
  }
  cusdisMountTimer = window.setTimeout(tryMount, 0)
}

export default defineClientConfig({
  enhance ({ router }) {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', resizeCusdisFrame)
      if (typeof router.isReady === 'function') {
        router.isReady().then(scheduleCusdisMount)
      } else {
        scheduleCusdisMount()
      }
    }

    router.afterEach(() => scheduleCusdisMount(true))
  }
})
