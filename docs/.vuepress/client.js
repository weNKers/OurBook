import { defineClientConfig } from 'vuepress/client'

const CUSDIS_SCRIPT = 'https://cusdis.com/js/cusdis.es.js'
const CUSDIS_APP_ID = 'bd74da9f-6f05-4c3c-bcf1-cb677d122c75'
const CUSDIS_MIN_HEIGHT = 320

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

function mountCusdis () {
  if (typeof window === 'undefined') return

  const page = document.querySelector('.vp-page')
  if (!page || page.querySelector('#cusdis_thread')) return

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

  const meta = page.querySelector('.vp-page-meta')
  page.insertBefore(thread, meta || null)

  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = `${CUSDIS_SCRIPT}?page=${encodeURIComponent(window.location.pathname)}`
  threadBody.appendChild(script)
}

export default defineClientConfig({
  enhance ({ app, router }) {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', resizeCusdisFrame)
    }

    app.mixin({
      mounted () {
        window.setTimeout(mountCusdis, 0)
      }
    })

    router.afterEach(() => {
      if (typeof window === 'undefined') return
      window.setTimeout(mountCusdis, 0)
    })
  }
})
