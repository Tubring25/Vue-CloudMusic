<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from "better-scroll"
export default {
  props: {
    probeType: { //调节在scroll事件出发中探针的活跃度
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: null
    },
    click: { //允许点击
      type: Boolean,
      default: true
    },
    listenScroll: { //监听滚动
      type: Boolean,
      default: false
    },
    pullup: { //上拉
      type: Boolean,
      default: false
    },
    refreshDelay: { //刷新延迟
      type: Number,
      default: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    })
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {//通过$refs访问ref的名称来访问DOM元素
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        let _this = this
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disbale () {
      this.scroll && this.scroll.disbale()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollTOElement () {
      this.scroll && this.scroll.scrollTOElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>
