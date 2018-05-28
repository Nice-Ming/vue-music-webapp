<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: []
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },

  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },

  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }

      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        let that = this
        this.scroll.on('scroll', pos => {
          that.$emit('scroll', pos)
        })
      }

      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit('scrollToEnd')
          }
        })
      }

      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },

    disable() {
      this.scroll && this.scroll.disable()
    },

    enable() {
      this.scroll && this.scroll.enable()
    },

    refresh() {
      this.scroll && this.scroll.refresh()
    },

    scrollTo() {
      // 因为需要从父组件传递参数 所以使用apply调用
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },

    scrollToElement() {
      // 因为需要从父组件传递参数 所以使用apply调用
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },

  watch: {
    data() {
      // 监听data 当父组件的请求得到数据后 refresh一次this.scroll
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style></style>
