<template>
  <transition>
    <div class="music-list">
      <div class="header" ref="header">
        <i class="fa fa-angle-left"></i>
      </div>
      <div class="text">
        <h1 class="title">{{headerTitle}}</h1>
      </div>
    </div>
    <scroll class="list" @scroll="scroll" :probe-type="probeType" :list-scroll="listenScroll" ref="list">
      <div class="music-list-wrapper">
        <div class="bg-ima" :style="bgStyle" ref="bgImage">
          <div class="filter"></div>
          <div class="text">
            <h2 class="list-title">{{title}}</h2>
            <p class="update">{{updateTime}}</p>
          </div>
        </div>
        <div class="song-list-wrapper">
          <div class="sequence-play" v-show="listDetail.length" @click="sequence">
            <i class="sequence-play icon-bofangicon"></i>
            <span class="text">Play All</span>
            <span class="count">(共{{listDetail.length}}首)</span>
          </div>
          <song-list @select="selectItem" :songs="listDetail"></song-list>
        </div>
      </div>
      <div v-show="!listDetail.length" class="loading-content">
        <loading></loading>
      </div>
    </scroll>
  </transition>
</template>

<script>
import Scroll from '../../base/scroll/scroll'
import Loading from '../../base/loading/loading'
import SongList from '../../base/song-list/song-list'
import {playlistMixin} from '../../common/js/mixin.js'
import {createSong} from '../../common/js/song.js'
import {mapGetters, mapActions} from 'vuex'

const RESERVED_HEIGHT = 44

export default {
  mixins: [playlistMixin],
  data () {
    return {
      listDetail: [],
      scrollY: 0,
      node: null,
      headerTitle: 'Singer'
    }
  },
  created () {
    if (!this.topList.id) {
      this.$router.push('/rank')
    }
    this._normalizeSongs(this.topList.tracks)
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
  },
  computed: {
    headerTitleTouchDown () {
      return this.topList.name
    },
    bgStyle () {
      return `background-image: url(${this.topList.coverImgUrl})`
    },
    title () {
      return this.headerTitleTouchDown
    },
    updateTime () {
      let time = new Date(this.topList.updateTime)
      let month = time.getMonth() + 1
      let day = time.getDate()
      return `last update: ${month}month${day}day`
    },
    ...mapGetters([
      'topList'
    ])
  },
  mothods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    _normalizeSongs (list) {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      let ret = []
      list.forEach((item) => {
        ret.push(createSong(item))
      })
      this.listDetail = ret
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.listDetail,
        index: index
      })
    },
    scroll (pos) {
      this.scrolly = pos.y
    },
    back () {
      this.$router.back()
    },
    sequence () {
      let list = this.listDetail
      this.sequencePlay({
        list: list
      })
    },
    ...mapActions([
      'selectPlay',
      'sequencePlay'
    ])
  },
  watch: {
    scrollY (newY) {
      const percent = Math.abs(newY / this.imageHeight)
      if (newY < (this.minTranslateY + RESERVED_HEIGHT - 2)) {
        this.headerTitle = this.headerTitleTouchDown
      } else {
        this.headerTitle = 'singer'
      }
      if (newY < 0) {
        this.$refs.header.style.background = `rgba(212, 68, 57, ${percent})`
      } else {
        this.$refs.header.style.background = `rgba(212, 68, 57, 0)`
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    }
  }
}
</script>
