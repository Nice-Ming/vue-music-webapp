<template>
	<scroll class="listview"
					ref="listview"
					:data="data"
					:listen-scroll="listenScroll"
					:probe-type = "probeType"
					@scroll="scroll"
	>
		<ul>
			<li class="list-group" v-for="group of data" ref="listGroup">
				<h2 class="list-group-title">{{ group.title }}</h2>
				<ul>
					<li class="list-group-item" v-for="item of group.items" @click="selectItem(item)">
						<img class="avatar" v-lazy="item.avatar">
						<span class="name">{{ item.name }}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut"
				 @touchstart.stop.prevent="onShortcutTouchStart"
				 @touchmove.stop.prevent="onShortcutTouchMove"
				 @touchend.stop
		>
			<ul>
				<li class="shortcut-item" v-for="(item, index) of shortcutList" :class="{current: currentIndex === index}" :data-index="index">{{ item }}</li>
			</ul>
		</div>
		<div class="list-fixed" ref="fixed" v-show="fixedTitle">
			<div class="fixed-title">{{ fixedTitle }}</div>
		</div>
		<div class="loading-wrapper" v-show="!data.length">
			<loading></loading>
		</div>
	</scroll>
</template>

<script>
import Scroll from 'components/base/scroll/scroll'
import Loading from 'components/base/loading/loading'
import { getDataAttribute } from 'common/js/dom.js'

export default {
  name: 'ListView',
  components: {
    Scroll,
    Loading
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },

  created() {
    this.touch = {}
    this.probeType = 3
    this.listenScroll = true
    this.listHeight = []
  },

  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },

    onShortcutTouchStart(event) {
      let anchorIndex = getDataAttribute(event.target, 'index')
      let firstTouch = event.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.anchorIndex = anchorIndex

      this._scrollTo(anchorIndex)
    },

    onShortcutTouchMove(event) {
      let firstTouch = event.touches[0]
      this.touch.y2 = firstTouch.pageY
      let diffIndex =
        ((this.touch.y2 - this.touch.y1) / this.shortcutItemHeight) | 0 // (num | 0) 效果等同于parseInt
      let anchorIndex = parseInt(this.anchorIndex) + diffIndex

      this._scrollTo(anchorIndex)
    },

    scroll(pos) {
      this.scrollY = pos.y
    },

    refresh() {
      this.$refs.listview.refresh()
    },

    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }

      let length = this.listHeight.length - 2
      index = Math.max(0, Math.min(index, length))

      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },

    _calculateListHeight() {
      // 计算歌手分组中每组标题距离顶部的高度
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0

      this.listHeight.push(height)

      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    }
  },

  computed: {
    shortcutList() {
      return this.data.map(item => item.title.substring(0, 1))
    },

    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : ''
    }
  },

  watch: {
    data() {
      // 父组件传递数据过来 DOM渲染完成后获取DOM相关的数据
      setTimeout(() => {
        this.shortcutItemHeight = document.querySelector(
          '.shortcut-item'
        ).clientHeight
        this.groupTitleHeight = this.$refs.fixed.clientHeight
        this._calculateListHeight()
      }, 20)
    },

    scrollY(newY) {
      // 索引高亮处理

      const listHeight = this.listHeight

      // 滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0
        return
      }

      // 滚动到中部
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]

        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }

      // 滚动到底部
      this.currentIndex = listHeight.length - 2
    },

    diff(newVal) {
      // 歌手分组标题置顶处理

      let fixedTop =
        newVal > 0 && newVal < this.groupTitleHeight
          ? newVal - this.groupTitleHeight
          : 0

      if (this.fixedTop === fixedTop) {
        return
      }

      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_listview.scss';
</style>
