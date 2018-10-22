<template>
  <div class="search-box">
    <!-- <i class="icon-search"></i> -->
    <input type="text" class="box" :placeholder="placeholder" v-model="query">
    <i class="icon-delete" v-show="query" @click="clear"></i>
    <!-- <span class="search">{{clickInfo}}</span> -->
  </div>
</template>

<script>
import {debounce} from '../../common/js/utl.js'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: '',
      clickInfo: '搜索'
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 300))
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/scss/variable.scss';

.search-box {
//   position: relative;
  width: 100%;
  height: 25px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(235, 235, 235);
  .icon-search {
    font-size: 24px;
    color: $color-text-g;
  }
  .box {
    flex: 1;
    line-height: 25px;
    background: $color-theme;
    color: #fff;
    border: none;
    font-size: $font-size-medium;
    outline: medium;
    &::placeholder {
      color: rgba(255, 255, 255, 0.6)
    }
  }
  .icon-delete {
    position: absolute;
    right: 12px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    border: none;
  }
  .search {
    padding: 0 5px;
    font-size: 14px;
    color: $color-text
  }
}
</style>
