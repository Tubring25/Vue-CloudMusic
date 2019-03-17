<template>
  <scroll
  class="listview"
  ref="listview"
  :listenScroll="listenScroll"
  @scroll="scroll"
  :probeType="probeType"
  >
    <ul>
      <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.id">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutStart"
    @touchmove.stop.prevent="onShortcutMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
        class="item"
        :data-index="index"
        :key="item.id"
        :class="{'current': currentIndex === index}"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 20
// const TITLE_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0
      // diff: -1
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  methods: {
    // 将select事件派发出去
    selectItem (item) {
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    onShortcutStart (e) {
      let anchorIndex = getData(e.target, 'index')
      //   touch开始时手指的位置
      let firstTouch = e.touches[0]
      // pageY为firstTouch中属性  
      this.touch.y1 = firstTouch.pageY
      //   记录当前索引值
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutMove (e) {
      let firshTouch = e.touches[0]
      this.touch.y2 = firshTouch.pageY
      //   偏移量  | 0 表示向下取整 相当于Math.floor()
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      //   move 时 的anchorIndex this.anchorIndex为字符串，需转化成整数
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      //   console.log(anchorIndex)
      this._scrollTo(anchorIndex)
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      // console.log(newY)
      const listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          return
        }
      }
      this.currentIndex = listHeight.length - 2
    }
  },
  //   Vue 的计算属性
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group {
    // padding: 10px 0;
    .list-group-title {
      height: 20px;
      line-height: 20px;
      padding-left: 12px;
      margin-bottom: 10px;
      font-size: $font-size-small;
      color: #fff;
      background:rgba(0, 0, 0, 0.1);
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 5px 0;
      margin: 0 5px;
      border-bottom: 1px solid rgb(228, 228, 228);
      &:last-child {
        border: none;
        margin-bottom: 10px;
      }
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 3px;
      }
      .name {
        margin-left: 20px;
        color: $color-text;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 200px 0;
    border-radius: 3px;
    text-align: center;
    font-family:Helvetica;
    .item {
      padding: 5px 5px;
      line-height: 1;
      color: $color-text-g;
      font-size: $font-size-small;
      font-weight: bold;
      &.current {
        color: $color-theme;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 20px;
      line-height: 20px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
