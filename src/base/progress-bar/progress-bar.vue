<template>
  <div class="progress-bar" ref="progressBar" @click="progressClikc">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {prefixStyle} from '../../common/js/dom.js'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  data () {
    return {
      newPercent: 0
    }
  },
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  methods: {
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const precent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChangeEnd', precent)
    },
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      this._triggerPercent()
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX)))
      this.$emit(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const precent = this.$refs.progress.clientWidth - barWidth
      this.$emit('percentChange', percent)
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';

.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      width: 30px;
      height: 30px;
      left: -8px;
      top: -13px;
      .progress-btn {
        position: relative;
        width: 16px;
        height: 16px;
        top: 7px;
        left: 7px;
        border: 5px solid $color-theme-l;
        border-radius: 50%;
        box-sizing: border-box;
        background: $color-theme;
      }
    }
  }
}
</style>
