<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { createFeedbackMailto, FEEDBACK_EMAIL } from '../feedback.mts'

const route = useRoute()
const { page } = useData()
const isFeedbackPage = computed(() => route.path.startsWith('/feedback/'))
const mailto = computed(() => {
  const pageUrl = new URL(route.path, 'https://www.wenkers.cn').href
  return createFeedbackMailto(
    `[页面反馈] ${page.value.title || '我们眼中的大学'}`,
    `反馈页面：${pageUrl}\n\n请在此输入反馈内容。`
  )
})
</script>

<template>
  <section v-if="!isFeedbackPage" class="page-email-feedback" aria-labelledby="page-email-feedback-title">
    <h2 id="page-email-feedback-title">页面反馈</h2>
    <p>发现内容或排版问题？可以邮件告诉我们。</p>
    <a :href="mailto">发送邮件反馈</a>
    <p>如果邮件应用没有打开，可手动发送至：{{ FEEDBACK_EMAIL }}</p>
  </section>
</template>
