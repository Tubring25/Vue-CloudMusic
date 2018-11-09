<template>
<transition name="slide" mode="out-in">
  <div class="music-list">
    <div class="header" ref="header">
      <div class="back" @click="back">
        <i class="fa fa-angle-left"></i>
      </div>
      <div class="text">
        <h1 class="titile"></h1>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
import Scroll from '../../base/scroll/scroll'
import SongList from '../../base/song-list/song-list'
import Loading from '../../base/loading/loading'
import {getRecommendListDetail} from '../../api/recommend.js'
import {ERR_OK} from '../../common/js/config.js'
import {createRecommendListSong} from '../../common/js/song.js'
import {playlistMixin} from '../../common/js/mixin.js'
import {mapGetters, mapActions} from 'vuex'

const RESEVED_HEIGHT = 44

export default {
  mixins: [playlistMixin],
  
}
</script>