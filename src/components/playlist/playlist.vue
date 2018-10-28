<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="iconfont" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}
              (<span class="count">{{playlist.length}}</span>)
            </span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent" :data="sequenceList" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li class="item" ref="listItem" @click="selectItem(item, index)" v-for="(item, index) in sequenceList" :key="index.id">
              <i class=" current fa" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confrim" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
    </div>
  </transition>
</template>

<script>
import Scroll from '../../base/scroll/scroll'
import Confirm from '../../base/confirm/confirm'
import {playNode, playMode} from '../../common/js/config.js'
import {shuffle} from '../../common/js/utl.js'
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  data () {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    },
    iconMode () {
      if (this.mode === playMode.sequence) {
        return 'icon-next'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'favorList'
    ])
  },
  methods: {
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.deleteSongList()
      this.hide()
      this.$emit('stopMusic')
    },
    getCurrentIcon (item) {
      if (this.currentSong.id === item.id) {
        return 'fa-volume-up'
      }
      return ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
    //   console.log(this.mode)
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
    //   console.log('index', index)
    this.setCurrentIndex(index)
    },
    deleteOne (item) {
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
        this.$emit('stopMusic')
      }
    },
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listContent.scorllToElement(this.$refs.listItem[index], 300)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  components: {
    Scroll,
    Confirm
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
@import '../../common/scss/mixin.scss';

.playlist {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  &.list-fade-enter-active,
  &.list_fade_leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    border-radius: 10px;
    background: $color-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .iconfont {
          margin-right: 10px;
          font-size: 20px;
          color: $color-text-g;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text;
          .count {
            position: relative;
            top: 1px;
          }
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-g;
          }
        }
      }
    }
    .list-content {
      overflow: hidden;
      max-height: 240px;
      .item {
        display: flex;
        overflow: hidden;
        height: 40px;
        padding: 0 30px 0 20px;
        align-items: center;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
        .fa-volume-up {
          margin-right: 5px;
          color: $color-theme;
        }
        .text {
          flex: 1;
          line-height: 20px;
          font-size: $font-size-medium;
          color: $color-text;
          @include no-wraper();
        }
        .delete {
          font-size: $font-size-small;
          color: $color-theme;
          @include extend-click();
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      font-size: $font-size-medium-x;
      background: $color-background;
      color: $color-text
    }
  }
}
</style>
