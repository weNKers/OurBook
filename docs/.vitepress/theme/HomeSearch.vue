<script setup lang="ts">
function openSiteSearch () {
  document.querySelector<HTMLButtonElement>('#local-search button')?.click()
}
</script>

<template>
  <button
    class="home-search-entry"
    type="button"
    aria-label="搜索学校、专业、学院或关键词"
    aria-haspopup="listbox"
    @click="openSiteSearch"
  >
    <svg class="home-search-entry__icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
    <span class="home-search-entry__label">搜索学校、专业、学院或关键词</span>
    <span class="home-search-entry__action" aria-hidden="true">开始搜索</span>
  </button>
</template>
