<template>
  <div style="display: none;">
    <!-- 微信分享图片策略 -->
    <img v-if="data.heroImage" :src="$withBase(data.heroImage)" alt="hero">
  </div>
</template>

<script>
export default {
  computed: {
    data () {
      return {
        heroImage: '/hero.jpg'
      };
    }
  }
}
</script>

