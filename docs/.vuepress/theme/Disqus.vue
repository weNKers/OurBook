<template>
  <div class="content disqus">
    <!-- 来必力City版安装代码 -->
    <div id="lv-container" data-id="city" data-uid="MTAyMC8zNjgyNy8xMzM2Mw==">
    <noscript> 为正常使用来必力评论功能请激活JavaScript</noscript>
    </div>
    <!-- City版安装代码已完成 -->
    <!-- <div id="disqus_thread"></div> -->
    <!-- <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>  -->
  </div>
</template>

<script>

export default {
  watch: {
    '$route' (next, prev) {
      // 防止同一页面重复渲染 留言模块
      if (next.path !== prev.path) {
        document.querySelector('#lv-container').innerHTML = null
        this.refresh()
      }
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      // disqus
      // window.disqus_config = function () {
      //   this.page.url = location.href;
      //   this.page.identifier = location.href;
      // };

      // var d = document, s = d.createElement('script');
      // s.src = 'https://wenkers-ourbook.disqus.com/embed.js';
      // s.setAttribute('data-timestamp', +new Date());
      // d.querySelector('.disqus').appendChild(s);
      
      // 路由切换重置留言板块
      (function(d, s) {
        var j, e = d.getElementsByTagName(s)[0];

        if (typeof LivereTower === 'function') { return; }

        j = d.createElement(s);
        j.src = 'https://cdn-city.livere.com/js/embed.dist.js';
        j.async = true;

        d.querySelector('.disqus').appendChild(j);
      })(document, 'script');
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
