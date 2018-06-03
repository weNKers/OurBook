<template>
  <div class="bdsharebuttonbox">
    <a href="#" class="bds_more" data-cmd="more">分享到：</a>
    <a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信">微信</a>
    <a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博">新浪微博</a>
    <a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间">QQ空间</a>
    <a href="#" class="bds_sqq" data-cmd="sqq" title="分享到QQ好友">QQ好友</a>
    <a href="#" class="bds_fbook" data-cmd="fbook" title="分享到Facebook">Facebook</a>
    <a href="#" class="bds_twi" data-cmd="twi" title="分享到Twitter">Twitter</a>
    <div id="bdshare" />
  </div>
</template>

<script>
export default {
  watch: {
    '$route' (next, prev) {
      // 防止同一页面重复渲染 留言模块
      if (next.path !== prev.path) {
        document.querySelector('#bdshare').innerHTML = null
        this.refresh()
      }
    }
  },
  mounted () {
    window._bd_share_config = {
      common: {
        bdSnsKey: {},
        bdMini: "2",
        bdMiniList: [
          "qzone",
          "tsina",
          "weixin",
          "renren",
          "tieba",
          "sqq",
          "youdao",
          "mail",
          "fbook",
          "twi",
          "linkedin",
          "evernotecn",
          "copy",
          "print"
        ],
        bdPic: "",
        bdStyle: "1",
        bdSize: "16"
      },
      share: { bdSize: 16 },
      image: {
        viewList: ["weixin", "tsina", "qzone", "sqq", "fbook", "twi"],
        viewText: "分享到：",
        viewSize: "16"
      },
      selectShare: {
        bdContainerClass: null,
        bdSelectMiniList: ["weixin", "tsina", "qzone", "sqq", "fbook", "twi"]
      }
    }
    this.refresh()
    document.querySelector('#bdshare')
      .appendChild(document.createElement('script'))
      .src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)
  },
  methods: {
    refresh () {
      window._bd_share_config.common.bdText = `我们眼中的大学 - ${this.$page.title} ${location.href} (想看更多？访问 @我们眼中的大学 网站：https://www.wenkers.cn/ ）`;
      window._bd_share_main && window._bd_share_main.init()
      this.clipboard();
    },
    clipboard () {
      const genCopy = ({title, author, link}) => {
        return [
          '',
          '',
          `标题：${title}`,
          `链接：${link}`,
          `来源：${author}`,
          '著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。',
        ]
      }

      document.querySelector('.content').oncopy = (event) => {
        if (!window.getSelection) {
          return
        }

        var selectionObj = window.getSelection()
        const data = {
          title: this.$page.title,
          author: '我们眼中的大学',
          link: location.href
        }

        if (selectionObj.toString().length < 42) {
          return
        }

        if (selectionObj.rangeCount) {
          var container = document.createElement("div");
          for (var i = 0, len = selectionObj.rangeCount; i < len; ++i) {
            container.appendChild(selectionObj.getRangeAt(i).cloneContents());
          }
        }
        
        if ('object' === typeof event.clipboardData) {
          event.clipboardData.setData('text/html',  container.innerHTML + genCopy(data).join('<br>'))
          container.remove();
          event.clipboardData.setData('text/plain', selectionObj.toString() + genCopy(data).join('\n'))
          event.preventDefault();
          return
        }

        document.body.append('<div id="symFixCopy" style="position: fixed; left: -9999px;">' +
          selectionObj.toString() + genCopy(data).join('<br>') + '</div>')
        window.getSelection().selectAllChildren(document.querySelectorAll('#symFixCopy')[0])
        setTimeout(function () {
          document.querySelector('#symFixCopy').remove()
        }, 200)
      }
    }
  }
}
</script>

<style lang="stylus">
.bdsharebuttonbox
  margin: 0 0 15px !important
</style>
