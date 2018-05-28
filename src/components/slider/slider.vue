<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot></slot>
		</div>
		<div class="dots">
			<span class="dot" v-for="(item, index) of dots" :class="{active: currentPageIndex === index}"></span>
		</div>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom.js'

export default {
  name: 'Slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },

  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },

  mounted() {
    // 当DOM加载好了之后执行 20ms是因为浏览器刷新时间一般为17/18ms 这是老师的经验得出来的
    setTimeout(() => {
      this._initDots()
      this._setSliderWidth()
      this._initSlider()

      if (this.autoPlay) {
        this._playSlider()
      }
    }, 20)

    // 当页面尺寸切换时需要重新计算slider的总宽度
    window.addEventListener('resize', e => {
      if (!this.slider) {
        return
      }
      // 此处的参数是因为DOM渲染完成后 已经克隆了节点 所以不用再累加克隆的节点的宽度
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },

  activated() {
    if (this.autoPlay) {
      this._playSlider()
    }
  },

  deactivated() {
    clearTimeout(this.timer)
  },

  beforeDestroy() {
    clearTimeout(this.timer)
  },

  methods: {
    _initDots() {
      this.children = this.$refs.sliderGroup.children
      this.dots = new Array(this.children.length)
    },

    _setSliderWidth(isResize) {
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },

    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      })

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX

        if (this.loop) {
          // 如果处于循环轮播中 会克隆首尾两个节点 所以此处还需-1
          pageIndex -= 1
        }

        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          this._playSlider()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        // 监听此事件作用是当用户滑动轮播图时 清除自动轮播的定时器 避免滚动冲突
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },

    _playSlider() {
      let pageIndex = this.currentPageIndex + 1

      if (this.loop) {
        // 如果处于循环轮播中 会克隆首尾两个节点 所以此处还需+1
        pageIndex += 1
      }

      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_slider.scss';
</style>
