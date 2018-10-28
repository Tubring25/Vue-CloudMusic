<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen" @touchstart.once="fristPlay">
        <div class="background">
          <div class="filter"></div>
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="fa fa-angle=down"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @click="changeMiddle">
          <transition name="middleL">
            <div class="middle-l" v-show="currentShow === 'cd'">
              <div class="cd-wrapper">
                <div class="cd" :class="cdCls">
                  <img class="image" :src="currentSong.image">
                </div>
              </div>
            </div>
          </transition>
          <transition name="middleR">
            <scroll class="middle-r" ref="lyricList" v-show="currentShow" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                <div class="currentLyric" v-if="currentLyric">
                  <p class="text" ref="lyricLine" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" :key="line.key">
                    {{line.txt}}
                  </p>
                </div>
                <p class="no-lyric" v-if="currentLyric === null">
                  {{upDatecurrentLyric}}
                </p>
              </div>
            </scroll>
          </transition>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChangeEnd="percentChangeEnd" @percentChage="percentChange"></progress-bar>
            </div>
            <span class="time timer-r">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="iconfont mode" :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="iconfont icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i class="iconfont" @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-test" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont" @click="toggleFavor(currentSong)" :class="getFavorIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-play" v-show="!fullScreen" @click.stop="open">
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <div class="desc" v-html="currentSong.singer"></div>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <progress-circle :radius="radius" :percent="percent">
            <i class="fa" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="iconfont icon-caidan1"></i>
        </div>
      </div>
    </transition>
    <playlist @stopMusic="stopMusic" ref="playlist"></playlist>
    <audio id="music-audio" ref="audio" @ended="end" autoplay @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import ProgressCircle from '../../base/progress-circle/progress-circle'
import ProgressBar from '../../base/progress-bar/progress-bar'
import Scroll from '../../base/scroll/scroll'
import Playlist from '../../components/playlist/playlist'
import Lyric from 'lyric-parser'
import {getSong, getLyric} from '../../api/song.js'
import {playMode} from '../../common/js/config.js'
import {shuffle} from '../../common/js/utl.js'
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  data () {
    return {
      url: '',
      songReady: false,
      currentTime: 0,
      duration: 0,
      percent: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: '',
      noLyric: false
    }
  },
  created () {
    this.move = false
  },
  computed: {
    iconMode () {
      if (this.mode === playMode.sequence) {
        return 'icon-next'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    miniIcon () {
      return this.playing ? 'fa-stop' : 'fa-play'
    },
    playIcon () {
      return this.playing ? 'icon-stop' : 'icon-bofangicon'
    },
    upDatecurrentLyric () {
      if (this.noLyric) {
        return '暂无歌词'
      } else {
        return '歌词加载中'
      }
    },
    ...mapGetters([
      'playlist',
      'fullScreen',
      'currentSong',
      'playing',
      'mode',
      'sequenceList',
      'favorList'
    ])
  },
  watch: {
    currentSong (newVal, oldVal) {
      if (!newVal.id || newVal.id === oldVal.id) {
        return
      }
    //   if (newVal.id === oldVal.id) {
    //     return
    //   }
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
      this._getSong(newVal.id)
    },
    url (newUrl) {
      this._getLyric(this.currentSong.id)
      this.$refs.audio.src = newUrl
      let stop = setInterval(() => {
        this.duration = this.$refs.audio.duration
        if (this.duration) {
          clearInterval(stop)
        }
      }, 150)
      this.setPlayingState(true)
    },
    currentTime () {
      this.percent = this.currentTime / this.duration
    }
  },
  methods: {
    firstPlay () {
    //   console.log('firstPlay')
      this.$refs.audio.play()
    },
    stopMusic () {
      this.$refs.audio.pause()
    //   console.log('删除最后一首歌的时候暂停音乐')
    },
    showPlaylist () {
      this.$refs.Playlist.show()
    },
    chageMiddle () {
      if (this.currentShow === 'cd') {
        this.currentShow = 'lyric'
      } else {
        this.currentShow = 'cd'
      }
    },
    getFavorIcon (song) {
      if (this.isFavor(song)) {
        return 'icon-like'
      }
      return 'icon-dislike'
    },
    toggleFavor (song) {
      if (this.isFavor(song)) {
        this.deleteFavorList(song)
      } else {
        this.saveFavorList(song)
      }
    },
    isFavor (song) {
      const index = this.favorList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    changeMode () {
      const mode = (this.mode +1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    _resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    percentChange (percent) {
      this.move = true
      const currentTime = this.duration * percent
      this.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    percentChangeEnd (percent) {
      this.move = false
      const currentTime = this.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.$refs.audio.play()
        this.setPlayingState(true)
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    updateTime (e) {
      if (this.move) {
        return
      }
      this.currentTime = e.target.currentTime
    },
    format (interval) {
      interval = interval | 0
      let minute = interval / 60 | 0
      let second = interval % 60 | 0
      if (second < 10) {
        second = '0' + second
      }
      return minute + ':' + second
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek()
      }
    },
    error () {
      this.songReady = true
    },
    ready () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    next () {
      if (!this.songReady) {
        return
      }
      if (this.Playlist.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    prev () {
      if (!this.songReady) {
        return
      }
      this.songReady = false
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    back () {
      this.setFullScreen(false)
      this.currentShow = 'cd'
    },
    open () {
      this.setFullScreen(true)
    },
    togglePlaying () {
      const audio = this.$refs.audio
      this.setPlayingState(!this.playing)
      this.playing ? audio.play() : audio.pause()
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    _getSong (id) {
      getSong(id).then((res) => {
        this.url = res.data.data[0].url
      })
    },
    _getLyric (id) {
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
      }
      this.noLyric = false
      getLyric(id).then((res) => {
        this.currentLyric = new Lyric(res.data.lrc.Lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
          this.currentLineNum = 0
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      }).catch(() => {
        this.currentLyric = null
        this.noLyric = true
        this.currentLineNum = 0
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavorlist',
      'deleteFavorList',
      'savePlayHistory'
    ])
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
@import '../../common/scss/mixin.scss';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: $color-background;
    z-index: 200;
    .background {
      position: absolute;
      width: 300%;
      height: 300%;
      left: -50%;
      top: -50%;
      opacity: 0.5;
      z-index: -1;
      filter: blur(30px);
      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.5;
      }
      .filterR {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.4;
        &.filterR-enter-active,
        &.filterR-leave-active {
          transition: all 0.3s
        }
        &.filterR-enter,
        &.filterR-leave-to {
          opacity: 0;
        }
        &.filterR-leave {
          opacity: 0.4;
        }
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 100;
        .fa-angle-down {
          display: block;
          padding: 5px 9px;
          font-size: 35px;
          color: $color-theme-l;
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        padding-top: 10px;
        line-height: 20px;
        text-align: center;
        font-size: $font-size-large;
        font-weight: bold;
        color: $color-text-l;
        @include no-wrap()
      }
      .subtitle {
        width: 70%;
        margin: 0 auto;
        line-height: 20px;
        text-align: center;
        font-size: $font-size-small-x;
        color: $color-text-l;
        @include no-wrap()
      }
    }
    .middle {
      display: flex;
      position: fixed;
      widows: 100%;
      top: 80px;
      bottom: 170px;
      align-items: center;
      font-size: 0;
      white-space: nowrap;
      .middle-l {
        display: inline-block;
        position: relative;
        width: 100%;
        height: 0;
        vertical-align: top;
        padding-top: 80%;
        &.middleL-enter-active,
        &.middleL-leave-active {
          transition: all 0.3s;
        }
        &.middleL-enter,
        &.middleL-leave-to {
          opacity: 0;
        }
        .cd-wrapper {
          position: absolute;
          width: 80%;
          height: 100%;
          left: 10%;
          top: 0;
          .cd {
            width: 100%;
            height: 100%;
            border: 15px solid rgba(255, 255, 255, 0.1);
            box-sizing: border-box;
            border-radius: 0.5;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              border-radius: 0.5;
            }
          }
        }
      }
      .middle-r {
        display: inline-block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        vertical-align: top;
        overflow: hidden;
        &.middleR-enter-active,
        &.middleR-leave-active {
          transition: all 0.3s;
        }
        &.middleR-enter,
        &.middleR-leave-to {
          opacity: 0;
        }
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height-step: 40px;
            color: $color-text-ggg;
            font-size: $font-size-medium;
            &.current {
              color: #fff;
            }
          }
          .no-lyric {
            line-height: 40px;
            margin-top: 60%;
            color: $color-text-ggg;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      width: 100%;
      position: absolute;
      bottom: 50px;
      .progress-wrapper {
        display: flex;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        align-items: center;
        .time {
          width: 30px;
          flex: 0 0 30px;
          line-height: 30px;
          font-size: $font-size-small;
          color: $color-text-l;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
            color: $color-text-ggg;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme-l;
          &.disable {
            color: $color-theme;
          }
        }
      }
    }
  }
}
</style>
