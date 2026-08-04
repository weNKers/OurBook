import { defineClientConfig } from 'vuepress/client'

const CUSDIS_SCRIPT = 'https://cusdis.com/js/cusdis.es.js'
const CUSDIS_APP_ID = 'bd74da9f-6f05-4c3c-bcf1-cb677d122c75'

function mountCusdis () {
  if (typeof window === 'undefined') return

  const page = document.querySelector('.vp-page')
  if (!page || page.querySelector('#cusdis_thread')) return

  const thread = document.createElement('section')
  thread.id = 'cusdis_thread'
  thread.className = 'cusdis-comments'
  thread.setAttribute('aria-labelledby', 'cusdis-comments-title')
  thread.innerHTML = `
    <h2 id="cusdis-comments-title">评论</h2>
    <p class="cusdis-comments__notice">欢迎留下你的想法。评论由 Cusdis 托管，提交后需要审核才会公开显示。</p>
    <div class="cusdis-comments__thread"></div>`

  const threadBody = thread.querySelector('.cusdis-comments__thread')
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
  thread.appendChild(script)
}

export default defineClientConfig({
  enhance ({ app, router }) {
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
