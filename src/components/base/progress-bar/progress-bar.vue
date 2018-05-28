<template>
  <div class="progress-bar" ref="progressBar" @click="onProgressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart="onProgressTouchStart"
           @touchmove="onProgressTouchMove"
           @touchend="onProgressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom.js'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  name: 'ProgressBar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },

  created() {
    this.touch = {}
  },

  methods: {
    onProgressClick(event) {
      // 原本是使用event.offsetX作为offsetWidth的值
      // 但是当点击progressBtn时 就会出错
      let rect = this.$refs.progressBar.getBoundingClientRect()
      let offsetWidth = event.pageX - rect.left
      this._offsetProgress(offsetWidth)
      this._triggerPercent()
    },

    onProgressTouchStart(event) {
      this.touch.initiated = true
      this.touch.startX = event.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },

    onProgressTouchMove(event) {
      let diffX = event.touches[0].pageX - this.touch.startX
      let offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + diffX)
      )
      this._offsetProgress(offsetWidth)
    },

    onProgressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },

    _triggerPercent() {
      let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      let percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },

    _offsetProgress(width) {
      this.$refs.progress.style.width = width + 'px'
      this.$refs.progressBtn.style[transform] = `translate3d(${width}px, 0, 0)`
    }
  },

  watch: {
    percent(newVal) {
      if (newVal >= 0 && !this.touch.initiated) {
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let offsetWidth = newVal * barWidth
        this._offsetProgress(offsetWidth)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_progress-bar.scss';
</style>