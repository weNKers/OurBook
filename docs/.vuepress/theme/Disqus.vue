<template>
  <div class="content disqus">
    <div id="disqus_thread"></div>
    <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript> 
  </div>
</template>

<script>

export default {
  watch: {
    '$route' () {
      this.refresh()
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      window.disqus_config = function () {
        this.page.url = location.href;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = location.href; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
      };

      var d = document, s = d.createElement('script');
      s.src = 'https://wenkers-ourbook.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      d.querySelector('.disqus').appendChild(s);
    }
  }
}
</script>

<style lang="stylus">
.content.disqus
  padding: 0 !important
  > *:first-child
    margin-top: 0 !important
</style>
