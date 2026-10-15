<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import directory from '../university-directory.json'

const isPaused = ref(false)
const isReducedMotion = ref(false)
const failedSchoolLogos = ref(new Set<string>())
const currentSchoolPage = ref(0)
let rotationTimer: ReturnType<typeof setInterval> | undefined
let motionPreference: MediaQueryList | undefined

const excerpts = [
  {
    text: '在中大，你可以真正体会什么叫做“为自己学习”：没有人强迫你，甚至课堂也甚少点名。',
    author: '高2013级5班 胡*丹',
    school: '中山大学',
    article: '学校综述二',
    href: '/universities/south/guangdong/sysu/1.html'
  },
  {
    text: '旅院人比较少，但是非常团结，一个学院的人基本互相都认识，氛围比较好。',
    author: '高2013级10班 李*颖',
    school: '南开大学',
    article: '旅游与服务学院——会展经济与管理专业',
    href: '/universities/north/tianjin/nankai/2.html'
  },
  {
    text: '经管给了我自己一条还不错的路，无论从薪酬待遇看，亦或是从自我提升和自我实现看，这只是我自己的一些看法。',
    author: '高2015级10班 况*君',
    school: '复旦大学',
    article: '经济管理试验班',
    href: '/universities/east/shanghai/fudan/2.html'
  }
]

const schools = directory.schools

function schoolLogoSrc (logo: string) {
  return logo.startsWith('https://') ? logo : `/${logo}`
}

function markSchoolLogoFailed (school: string) {
  failedSchoolLogos.value = new Set(failedSchoolLogos.value).add(school)
}

function moveSchoolPage (direction: number) {
  const pageCount = Math.ceil(schools.length / 8)
  currentSchoolPage.value = (currentSchoolPage.value + direction + pageCount) % pageCount
}

function syncRotation () {
  if (rotationTimer) clearInterval(rotationTimer)
  if (!isPaused.value && !isReducedMotion.value) {
    rotationTimer = setInterval(() => moveSchoolPage(1), 7000)
  }
}

function syncMotionPreference () {
  isReducedMotion.value = motionPreference?.matches ?? false
}

watch([isPaused, isReducedMotion], syncRotation)

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncMotionPreference()
  syncRotation()
  motionPreference.addEventListener('change', syncMotionPreference)
})

onBeforeUnmount(() => {
  if (rotationTimer) clearInterval(rotationTimer)
  motionPreference?.removeEventListener('change', syncMotionPreference)
})

const visibleSchools = computed(() => Array.from(
  { length: 8 },
  (_, offset) => schools[(currentSchoolPage.value * 8 + offset) % schools.length]
))
</script>

<template>
  <section class="home-highlights" aria-label="文章摘句与收录高校">
    <div class="home-highlights__section home-excerpts" aria-labelledby="home-excerpts-title">
      <div class="home-highlights__heading">
        <div>
          <p class="home-highlights__eyebrow">来自真实的大学生活记录</p>
          <h2 id="home-excerpts-title">文章里的声音</h2>
        </div>
          <p class="home-highlights__intro">以下摘句选自2017年前后的投稿，保留作者当时的个人视角。</p>
      </div>

      <div class="home-excerpts__grid">
        <article v-for="excerpt in excerpts" :key="excerpt.href" class="home-excerpt">
          <p class="home-excerpt__quote">“{{ excerpt.text }}”</p>
          <div class="home-excerpt__footer">
            <span class="home-excerpt__author">{{ excerpt.author }}</span>
            <a :href="excerpt.href" class="home-excerpt__source">
              {{ excerpt.school }} · {{ excerpt.article }} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>
    </div>

    <div class="home-highlights__section home-schools" aria-labelledby="home-schools-title">
      <div class="home-highlights__heading home-schools__heading">
        <div>
          <p class="home-highlights__eyebrow">从亲历者的视角了解校园</p>
          <h2 id="home-schools-title">内容涉及的高校</h2>
        </div>
        <div class="home-schools__controls">
          <button type="button" aria-label="上一组高校" @click="moveSchoolPage(-1)">上一组</button>
          <button type="button" aria-label="下一组高校" @click="moveSchoolPage(1)">下一组</button>
          <button
            class="home-schools__toggle"
            type="button"
            :disabled="isReducedMotion"
            @click="isPaused = !isPaused"
          >
            {{ isReducedMotion ? '系统已减少动态效果' : isPaused ? '继续校徽轮播' : '暂停校徽轮播' }}
          </button>
        </div>
      </div>

      <TransitionGroup name="home-logo" tag="div" class="home-schools__logos">
        <div v-for="school in visibleSchools" :key="school.school" class="home-school-logo">
          <img
            v-if="!failedSchoolLogos.has(school.school)"
            :src="schoolLogoSrc(school.logo)"
            :alt="`${school.schoolTitle}校徽`"
            loading="lazy"
            decoding="async"
            @error="markSchoolLogoFailed(school.school)"
          >
          <span v-else class="home-school-logo__fallback">{{ school.schoolTitle }}</span>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>
