<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import directory from '../university-directory.json'

const isExcerptsPaused = ref(false)
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
  },
  {
    text: '其实人生中的很多米诺骨牌都是在不经意间被推倒的，像是踩到梧桐叶留下的一声清响。',
    author: '14级本科生 徐*逸',
    school: '东南大学',
    article: '信息科学与工程学院',
    href: '/universities/east/jiangsu/seu/2.html'
  },
  {
    text: '因为其中的每一个字都直击我脑海迷茫深处，迫使我看清现实。',
    author: '高2012级6班 王*桐',
    school: '浙江大学',
    article: '学校综述一',
    href: '/universities/east/zhejiang/zju/'
  },
  {
    text: '直到尘埃落定知道自己要在这所大学度过接下来的四年，我才慢慢发现，华科所拥有的而我不知道的东西，真的很多很多。',
    author: '高2015级16班 彭*霖',
    school: '华中科技大学',
    article: '学校综述',
    href: '/universities/central/hubei/hust/'
  },
  {
    text: '刚入学的我，喜欢比较，拿北师和南开比，觉得这里没南开好、那里没南开好，于是满满的失望和想念……',
    author: '2015级15班 舒*航',
    school: '北京师范大学',
    article: '学校综述三',
    href: '/universities/north/beijing/bnu/1.html'
  },
  {
    text: '个人而言，学建筑学能够提高我们的绘图功底。无论是速写，素描，水彩，水粉画都不会落下。并且可以亲手设计自己的建筑，我觉得是一件十分有成就感的事情。',
    author: '2015级理科15班 宋*霖',
    school: '中南大学',
    article: '建筑与艺术学院建筑系',
    href: '/universities/central/hunan/csu/1.html'
  },
  {
    text: '我个人觉得，和传统的财经院校相比，南大会计系更希望将学生培养为科研人才。',
    author: '高2013级10班 汪*弋',
    school: '南京大学',
    article: '商学院会计系',
    href: '/universities/east/jiangsu/nju/2.html'
  },
  {
    text: '我觉得选择港校的重点不是选择香港的哪一所大学，而是为什么选择香港这个城市。',
    author: '高2012级27班 吕*',
    school: '香港中文大学',
    article: '学校综述',
    href: '/universities/hongkong-macau-taiwan/xianggang/cuhk/'
  },
  {
    text: '三年前，我也捧着一本《我们眼中的大学》幻想自己进入大学的生活，感觉大学就是个宏伟神圣的殿堂，充满未知的，浪漫的，疯狂的故事。',
    author: '高2014级10班 盛*薇',
    school: '香港大学',
    article: '在港大',
    href: '/universities/hongkong-macau-taiwan/xianggang/hku/3.html'
  },
  {
    text: '当初被亲戚朋友轰炸式劝说下的忐忑和迷茫，我到现在都难以忘记。',
    author: '高2013级5班 陈*舟',
    school: '香港城市大学',
    article: '学校综述二',
    href: '/universities/hongkong-macau-taiwan/xianggang/cityu/1.html'
  },
  {
    text: '无论最后结果是喜是忧，都希望大家能够云淡风轻，毕竟你们的人生才刚刚开始。',
    author: '高2014级21班 向*',
    school: '香港城市大学',
    article: '学校综述三',
    href: '/universities/hongkong-macau-taiwan/xianggang/cityu/2.html'
  },
  {
    text: '繁华港城钟神秀，人文城大谱春秋。',
    author: '高2013级8班 张*皎',
    school: '香港城市大学',
    article: '人文社会科学院',
    href: '/universities/hongkong-macau-taiwan/xianggang/cityu/7.html'
  },
  {
    text: '一年之后的今天，我庆幸我选择了这个城市。',
    author: '高2013级21班 刘*琳',
    school: '香港理工大学',
    article: '学校综述+商科',
    href: '/universities/hongkong-macau-taiwan/xianggang/polyu/2.html'
  },
  {
    text: '直到我来到她身边的时候才发现，同济真的很美很美！！',
    author: '高2012级25班 罗*',
    school: '同济大学',
    article: '学校综述2013',
    href: '/universities/east/shanghai/tongji/1.html'
  },
  {
    text: '能得到学弟的信任来写这篇稿子，真的很感动。',
    author: '高2015级3班 卓*港',
    school: '同济大学',
    article: '电子与信息工程学院',
    href: '/universities/east/shanghai/tongji/8.html'
  },
  {
    text: '人大没有多大名气，我填志愿之前都不知道这么一所大学，然后我妈帮我选了这个，我很爱她，于是我就来了。',
    author: '高2013级3班 陈*良',
    school: '中国人民大学',
    article: '学校综述三',
    href: '/universities/north/beijing/ruc/2.html'
  },
  {
    text: '哥们现在的姿态是穿着一枚小短裤坐在寝室里，阳光明媚，但不忧伤。',
    author: '高2011级20班 陈*',
    school: '浙江大学',
    article: '浙江大学工科大类',
    href: '/universities/east/zhejiang/zju/7.html'
  },
  {
    text: '毕竟无论什么事情，提升自己才是对未来最好的安慰。',
    author: '2014级 刘*',
    school: '复旦大学',
    article: '学长眼中的复旦',
    href: '/universities/east/shanghai/fudan/10.html'
  }
]

const avatarPalettes = [
  { background: '#f1ded5', skin: '#e7ad88', hair: '#49343a', shirt: '#7b618e' },
  { background: '#dce9e5', skin: '#c88765', hair: '#292e3c', shirt: '#4d8279' },
  { background: '#e6e2f2', skin: '#f0c7a4', hair: '#5a3d31', shirt: '#5c7197' },
  { background: '#f1e6c9', skin: '#d99d75', hair: '#332d2b', shirt: '#b36f50' },
  { background: '#dce8f0', skin: '#f0c5a4', hair: '#463a32', shirt: '#6383a0' },
  { background: '#f0dfe8', skin: '#b97959', hair: '#28262c', shirt: '#a75d72' },
  { background: '#e1ebd9', skin: '#e9bb96', hair: '#674638', shirt: '#6b8b66' },
  { background: '#eee0d4', skin: '#d99a72', hair: '#392c34', shirt: '#b47b5f' },
  { background: '#dce9eb', skin: '#f0c8ad', hair: '#594538', shirt: '#4f818b' },
  { background: '#e9e0f0', skin: '#bd805f', hair: '#302a30', shirt: '#806496' }
]
const avatarHairShapes = [
  'M12 23c-2-11 3-18 12-18 9 0 15 7 12 19l-5-4-2-8c-4 4-10 5-16 4l-1 8z',
  'M11 23c-2-12 4-19 13-19s16 8 13 20l-2 18h-5l2-26c-5 4-12 5-19 2l1 24H9z',
  'M11 22c0-11 5-17 13-17 9 0 14 7 13 18l-5-5c-4 3-10 3-15 0l-3 7z',
  'M10 24C7 11 14 4 24 4c11 0 17 9 14 21l-4-2c1-10-3-15-10-15-7 0-11 5-10 15z',
  'M12 21C9 9 15 4 24 4c8 0 14 6 12 17l-5-3-1-7c-4 5-10 7-18 6z',
  'M10 23C8 12 14 4 24 4c10 0 16 8 14 19l-4-4-2-7c-3 5-10 7-18 5l-1 8z'
]
const illustratedExcerpts = excerpts.map((excerpt, index) => ({
  ...excerpt,
  avatar: {
    variant: index + 1,
    ...avatarPalettes[index % avatarPalettes.length],
    hairShape: avatarHairShapes[index % avatarHairShapes.length],
    glasses: index % 6 === 2
  }
}))

const excerptRows = [
  { id: 'first', label: '第一排文章摘句', direction: 'forward', excerpts: illustratedExcerpts.slice(0, 10) },
  { id: 'second', label: '第二排文章摘句', direction: 'reverse', excerpts: illustratedExcerpts.slice(10, 20) }
].map((row) => ({ ...row, cards: [...row.excerpts, ...row.excerpts] }))

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
  if (!isReducedMotion.value) {
    rotationTimer = setInterval(() => moveSchoolPage(1), 7000)
  }
}

function syncMotionPreference () {
  isReducedMotion.value = motionPreference?.matches ?? false
}

watch(isReducedMotion, syncRotation)

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
    <div
      class="home-highlights__section home-excerpts"
      :class="{ 'home-excerpts--paused': isExcerptsPaused || isReducedMotion }"
      aria-labelledby="home-excerpts-title"
    >
      <div class="home-highlights__heading">
        <div>
          <p class="home-highlights__eyebrow">来自真实的大学生活记录</p>
          <h2 id="home-excerpts-title">文章里的声音</h2>
        </div>
        <div class="home-highlights__intro-group">
          <p class="home-highlights__intro">以下摘句选自站内投稿，呈现不同高校与专业的亲历视角。</p>
          <button
            class="home-carousel-toggle"
            type="button"
            :disabled="isReducedMotion"
            @click="isExcerptsPaused = !isExcerptsPaused"
          >
            {{ isReducedMotion ? '系统已减少动态效果' : isExcerptsPaused ? '继续摘句轮播' : '暂停摘句轮播' }}
          </button>
        </div>
      </div>

      <div class="home-excerpts__viewport" role="group" aria-label="二十篇投稿摘句">
        <div
          v-for="row in excerptRows"
          :key="row.id"
          class="home-excerpts__lane"
          :class="`home-excerpts__lane--${row.direction}`"
          role="group"
          :aria-label="row.label"
        >
          <article
            v-for="(excerpt, index) in row.cards"
            :key="`${row.id}-${index}`"
            class="home-excerpt"
            :aria-hidden="index >= row.excerpts.length ? 'true' : undefined"
            :data-quote-source="index < row.excerpts.length ? excerpt.href : undefined"
          >
            <p class="home-excerpt__quote">“{{ excerpt.text }}”</p>
            <div class="home-excerpt__footer">
              <div class="home-excerpt__byline">
                <span class="home-excerpt__avatar" aria-hidden="true">
                  <svg
                    :data-avatar-variant="excerpt.avatar.variant"
                    :data-avatar-palette="(excerpt.avatar.variant - 1) % avatarPalettes.length"
                    :data-avatar-hairstyle="(excerpt.avatar.variant - 1) % avatarHairShapes.length"
                    viewBox="0 0 48 48"
                    focusable="false"
                  >
                    <circle cx="24" cy="24" r="24" :fill="excerpt.avatar.background" />
                    <path d="M6 48c1-10 7-15 18-15s17 5 18 15H6Z" :fill="excerpt.avatar.shirt" />
                    <path d="M20 29h8v10h-8z" :fill="excerpt.avatar.skin" />
                    <ellipse cx="24" cy="21" rx="10" ry="12" :fill="excerpt.avatar.skin" />
                    <path :d="excerpt.avatar.hairShape" :fill="excerpt.avatar.hair" />
                    <circle cx="20" cy="22" r="0.9" :fill="excerpt.avatar.hair" />
                    <circle cx="28" cy="22" r="0.9" :fill="excerpt.avatar.hair" />
                    <path d="M21 27c2 1.5 4 1.5 6 0" fill="none" stroke="#8b5148" stroke-linecap="round" stroke-width="1.2" />
                    <g v-if="excerpt.avatar.glasses" fill="none" :stroke="excerpt.avatar.hair" stroke-width="1.2">
                      <circle cx="20" cy="22" r="3.2" />
                      <circle cx="28" cy="22" r="3.2" />
                      <path d="M23.2 22h1.6" />
                    </g>
                  </svg>
                </span>
                <span class="home-excerpt__author">{{ excerpt.author }}</span>
              </div>
              <a :href="excerpt.href" class="home-excerpt__source" :tabindex="index >= row.excerpts.length ? -1 : undefined">
                {{ excerpt.school }} · {{ excerpt.article }} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="home-highlights__section home-schools" aria-labelledby="home-schools-title">
      <div class="home-highlights__heading home-schools__heading">
        <div>
          <p class="home-highlights__eyebrow">从亲历者的视角了解校园</p>
          <h2 id="home-schools-title">内容涉及的高校</h2>
        </div>
        <div class="home-schools__controls" aria-label="切换高校">
          <button type="button" aria-label="上一组高校" title="上一组高校" @click="moveSchoolPage(-1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button type="button" aria-label="下一组高校" title="下一组高校" @click="moveSchoolPage(1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <TransitionGroup name="home-logo" tag="div" class="home-schools__logos" role="list" aria-label="高校校徽，两排展示">
        <div v-for="school in visibleSchools" :key="school.school" class="home-school-logo" role="listitem">
          <a
            :href="`/universities/${school.region}/${school.city}/${school.school}/`"
            :aria-label="`${school.schoolTitle}：查看学校介绍`"
          >
            <img
              v-if="!failedSchoolLogos.has(school.school)"
              :src="schoolLogoSrc(school.logo)"
              :alt="`${school.schoolTitle}校徽`"
              loading="lazy"
              decoding="async"
              @error="markSchoolLogoFailed(school.school)"
            >
            <span v-else class="home-school-logo__fallback">{{ school.schoolTitle }}</span>
          </a>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>
