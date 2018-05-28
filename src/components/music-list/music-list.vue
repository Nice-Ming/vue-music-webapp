<template>
  <div class="music-list">
    <div class="back-btn" @click="back">
      <i class="icon-back"></i>
    </div>
    <h2 class="title" v-html="title" ref="title"></h2>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="cover" ref="cover"></div>
      <div class="play-wrapper">
        <div class="play-btn" v-show="songs.length" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list" ref="list" :data="songs" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :rank="rank" :songs="songs" @select="select"></song-list>
      </div>
      <div class="loading-wrapper" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/base/scroll/scroll'
import Loading from 'components/base/loading/loading'
import SongList from 'components/base/song-list/song-list'
import { getStyle, prefixStyle } from 'common/js/dom.js'
import { mapActions } from 'vuex'
import { playListMixin } from 'common/js/mixin.js'

const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  name: 'MusicList',
  mixins: [playListMixin],
  components: {
    Scroll,
    Loading,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      scrollY: 0
    }
  },

  mounted() {
    this.titleHeight = this.$refs.title.clientHeight
    this.bgImagePaddingTop = getStyle(this.$refs.bgImage, 'paddingTop') // getStyle()获取的值自带单位
    this.bgImageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = this.bgImageHeight - this.titleHeight
    this.$refs.list.$el.style.top = this.bgImageHeight + 'px'
  },

  created() {
    this.probeType = 3
    this.listenScroll = true
  },

  methods: {
    playListHandle(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    back() {
      this.$router.back()
    },

    scroll(pos) {
      this.scrollY = pos.y
    },

    select(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },

    random() {
      this.randomPlay({
        list: this.songs
      })
    },

    ...mapActions(['selectPlay', 'randomPlay'])
  },

  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },

  watch: {
    scrollY(newY) {
      let zIndex = 0
      let translateY = Math.min(this.maxTranslateY, -newY)
      let percent = Math.abs(newY / this.bgImageHeight)

      if (newY > 0) {
        let scale = percent + 1
        zIndex = 2
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      } else {
        let blur = Math.min(20, percent * 20)
        this.$refs.cover.style[backdrop] = `blur(${blur}px)`
      }

      this.$refs.layer.style[transform] = `translate3d(0, ${-translateY}px, 0)`

      if (-newY > this.maxTranslateY) {
        zIndex = 2
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = this.titleHeight + 'px'
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = this.bgImagePaddingTop
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = 'block'
      }

      this.$refs.bgImage.style.zIndex = zIndex
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
@import './_music-list.scss';
</style>
