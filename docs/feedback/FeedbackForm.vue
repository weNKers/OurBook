<script setup lang="ts">
import { ref } from 'vue'
import { FEEDBACK_EMAIL } from '../.vitepress/feedback'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')

function sendFeedback () {
  const body = [
    `称呼：${name.value.trim() || '未填写'}`,
    `回复邮箱：${email.value.trim() || '未填写'}`,
    `反馈页面：${window.location.href}`,
    '',
    message.value.trim()
  ].join('\n')
  const query = new URLSearchParams({
    subject: `[站点反馈] ${subject.value.trim()}`,
    body
  })

  window.location.href = `mailto:${FEEDBACK_EMAIL}?${query}`
}
</script>

<template>
  <form class="email-feedback-form" @submit.prevent="sendFeedback">
    <label for="feedback-name">称呼（选填）</label>
    <input id="feedback-name" v-model="name" name="name" autocomplete="name">

    <label for="feedback-email">联系邮箱（选填）</label>
    <input id="feedback-email" v-model="email" name="email" type="email" autocomplete="email">

    <label for="feedback-subject">主题</label>
    <input id="feedback-subject" v-model="subject" name="subject" required maxlength="120">

    <label for="feedback-message">反馈内容</label>
    <textarea id="feedback-message" v-model="message" name="message" required maxlength="5000" rows="8" />

    <button type="submit">打开邮件应用</button>
    <p class="email-feedback-form__hint">
      点击后会打开你的邮件应用，并预填收件人和反馈内容；请检查邮件后再发送。
    </p>
  </form>
</template>
