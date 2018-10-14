<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :data="playList">
      <div>
        <div v-show="banner.length" class="decorate" v-if="banner.length"></div>
        <div v-if="banner.length" class="slider-wrapper">
          <slider>
            <div v-for="item in banner" :key="item.id" @click.stop="selectBanner(item)">
              <img :src="item.picUrl">
            </div>
          </slider>
        </div>
        <div class="recommend-list" ref="recommendList">
          <h1 class="title">推荐歌单</h1>
          <ul>
            <li class="item" v-for="item in playList" :key="item.id">
              <div class="icon" @click="selectList(item)">
                <div class="gradients"></div>
                <img v-lazy="item.picUrl">
              </div>
              <p class="play-count">
                <i class="fa fa-headphones"></i>
                {{Math.floor(item.playCount / 10000) }}万
              </p>
              <div class="text">
                <p class="name">{{item.name}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>  
  </div>
</template>
<script>
import Scroll from "../../base/scroll/scroll.vue"
import Slider from "../../base/slider/slider"
import {
  getBanner,
  getRecommendList,
  getRecommendMusic
} from "../../api/recommend.js"
import { ERR_OK } from "../../common/js/config.js"

export default {
  // minins: [palyListMixin],
  data() {
    return {
      banner: [],
      playList: [],
    }
  },
  created() {
    this._getBanner()
    this._getRecommendList()
  },
  methods: {
    _getBanner() {
      getBanner().then(res => {
        if (res.status === ERR_OK) {
          let list = res.data.banners
          this.banner = list.splice(4)
        } else {
          console.log("Banner 获取失败")
        }
      })
    },
    _getRecommendList() {
      getRecommendList().then(res => {
        if (res.status === ERR_OK) {
          this.playList = res.data.result
        } else {
          console.error("getRecommendList 获取失败")
        }
      })
    },
    // selectBanner (item) {
    //   let regHttp = /^http/
    //   let regSong = /\/song\?id/
    //   if (regHttp.test(item.url)) {
    //     window.open(item.url)
    //   }
    //   if (regSong.test(url)) {
    //     getSong
    //   }
    // }
    _getRecommendMusic () {
      getRecommendMusic().then((res) => {
        if (res.status === ERR_OK) {
          let list = res.data.result.map((item) => {
            return creatRecommendSong(item)
          })
          list.splice(8)
          this.recommendMusic = list
        } else {
          console.error('getRecommendMusic 获取失败')
        }
      })
    },
    
  },
  components: {
    Scroll,
    Slider
  }
}
</script>

<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/mixin.scss";
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  z-index: 100;
  .recommend-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .decorate {
      position: absolute;
      top: -30vh;
      z-index: -10;
      background: $color-theme;
      width: 100%;
      height: 50vh;
      vertical-align: inherit;
    }
    .slider-wrapper {
      width: 96%;
      margin: 0 auto;
      border-radius: 5px;
      overflow: hidden;
    }
    .recommend-list {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: $font-size-medium;
        font-weight: bold;
        color: $color-text;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          .gradients {
            position: absolute;
            top: 0;
            width: 100%;
            height: 35px;
            border-radius: 3px;
            background: linear-gradient(
              rgba(109, 109, 109, 0.4),
              rgba(255, 255, 255, 0)
            );
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
        .play-count {
          position: absolute;
          top: 5px;
          right: 8px;
          font-size: $font-size-small-s;
          color: $color-text-l;
        }
        .text {
          float: left;
          line-height: 16px;
          text-align: left;
          height: 40px;
          line-height: 16px;
          overflow: hidden;
          margin-bottom: 10px;
          font-size: $font-size-small;
        }
      }
    }
    .recommend-song {
      margin-top: -20px;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: $font-size-medium;
        font-weight: bold;
        color: $color-text;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
        .text {
          line-height: 16px;
          text-align: left;
          height: 16px;
          @include no-wrap();
          font-size: $font-size-small;
        }
        .singer {
          line-height: 16px;
          margin-bottom: 10px;
          text-align: left;
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-g;
        }
      }
    }
  }
}
</style>

