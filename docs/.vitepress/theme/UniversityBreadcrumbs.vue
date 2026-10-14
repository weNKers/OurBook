<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import directory from '../university-directory.json'

const route = useRoute()
const parts = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  const result = [{ label: '大学', href: '/universities/' }]
  const region = directory.regions.find((item) => path === `/universities/${item.slug}` || path.startsWith(`/universities/${item.slug}/`))
  if (!region) return []
  result.push({ label: region.title, href: `/universities/${region.slug}/` })
  const city = directory.schools.find((item) => path.includes(`/universities/${region.slug}/${item.city}`))
  if (city) {
    result.push({ label: city.cityTitle, href: `/universities/${region.slug}/${city.city}/` })
    const school = directory.schools.find((item) => path.startsWith(`/universities/${region.slug}/${item.city}/${item.school}`))
    if (school) result.push({ label: school.schoolTitle, href: `/universities/${region.slug}/${school.city}/${school.school}/` })
  }
  return result
})
</script>

<template>
  <nav v-if="parts.length" class="university-breadcrumbs" aria-label="面包屑导航">
    <a v-for="part in parts" :key="part.href" :href="part.href">{{ part.label }}</a>
  </nav>
</template>
