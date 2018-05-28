<template>
	<div class="player" v-show="playList.length">
		<transition name="normal"
								@enter="enter"
								@after-enter="afterEnter"
								@leave="leave"
								@after-leave="afterLeave"
		>
			<div class="normal-player" v-show="fullScreen">
				<div class="top">
					<div class="back-btn" @click="back">
						<i class="icon-back"></i>
					</div>
					<h2 class="title" v-html="currentSong.name"></h2>
					<h3 class="subtitle" v-html="currentSong.singer"></h3>
				</div>
				<div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="cdRotateCls">
								<img class="cd-image" :src="currentSong.image">
							</div>
						</div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
					</div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   v-for="(line, index) of currentLyric.lines"
                   ref="lyricLine"
                   :class="{current: currentLineNum === index}"
                >{{ line.txt }}</p>
              </div>
            </div>
          </scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{active: currentShow === 'cd'}"></span>
						<span class="dot" :class="{active: currentShow === 'lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left">
							<i :class="modeIcon" @click="changePlayMode"></i>
						</div>
						<div class="icon i-left" :class="disableCls">
							<i class="icon-prev" @click="prev"></i>
						</div>
						<div class="icon i-center" :class="disableCls">
							<i :class="playIcon" @click="togglePlaying"></i>
						</div>
						<div class="icon i-right" :class="disableCls">
							<i class="icon-next" @click="next"></i>
						</div>
						<div class="icon i-right">
							<i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
						</div>
					</div>
				</div>
				<div class="background" :style="bgStyle"></div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="mini-cd" >
					<img class="mini-cd-image" :class="cdRotateCls" :src="currentSong.image">
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
          <progress-circle :radius="radius" :percent="percent">
					  <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
				</div>
				<div class="control">
					<i class="icon-playlist" @click.stop="showPlaylist"></i>
				</div>
			</div>
		</transition>
    <playlist ref="playlist"></playlist>
		<audio ref="audio"
           @canplay="audioCanPlay"
           @play="audioPlay"
           @error="audioError"
           @timeupdate="audioTimeUpdate"
           @ended="audioEnd"
    ></audio>
  </div>
</template>

<script>
import ProgressBar from 'components/base/progress-bar/progress-bar'
import ProgressCircle from 'components/base/progress-circle/progress-circle'
import Scroll from 'components/base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
import animations from 'create-keyframe-animation'
import Lyric from 'lyric-parser'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { ERR_OK } from 'api/config.js'
import { prefixStyle } from 'common/js/dom.js'
import { playMode } from 'common/js/config.js'
import { shuffle } from 'common/js/util.js'
import { playerMixin } from 'common/js/mixin.js'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  name: 'Player',
  mixins: [playerMixin],
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  },
  data() {
    return {
      songUrl: '',
      songReady: false,
      currentTime: 0,
      currentShow: 'cd',
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: '',
      touch: {}
    }
  },

  methods: {
    back() {
      this.setFullScreen(false)
    },

    open() {
      this.setFullScreen(true)
    },

    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },

    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },

    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale()

      this.$refs.cdWrapper.style.transition = 'all .4s'
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },

    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },

    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      this.currentLyric && this.currentLyric.togglePlay()
    },

    next() {
      if (!this.songReady) {
        // 当刚切换歌曲瞬间 设置标志位判断当前歌曲是否加载到可播放状态
        // 可以防止用户疯狂点击切换按钮 导致的DOMException报错
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },

    prev() {
      if (!this.songReady) {
        // 同next()中的注释
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },

    showPlaylist() {
      this.$refs.playlist.show()
    },

    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.currentLyric && this.currentLyric.seek(0)
    },

    audioCanPlay() {
      this.savePlayHistory(this.currentSong)
    },

    audioPlay() {
      this.songReady = true
    },

    audioError() {
      clearTimeout(this.timer)
      this.songReady = true
    },

    audioTimeUpdate(event) {
      this.currentTime = event.target.currentTime
    },

    audioEnd() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },

    format(time) {
      time = time | 0
      let minute = (time / 60) | 0
      let second = this._pad(time % 60)
      return `${minute}:${second}`
    },

    onProgressBarChange(percent) {
      let currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      this.currentLyric && this.currentLyric.seek(currentTime * 1000)
    },

    middleTouchStart(event) {
      this.touch.initiated = true
      // 用来判断是否为同一次移动
      this.touch.moved = false
      let touch = event.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },

    middleTouchMove(event) {
      if (!this.touch.initiated) {
        return
      }
      let touch = event.touches[0]
      let diffX = touch.pageX - this.touch.startX
      let diffY = touch.pageY - this.touch.startY

      if (Math.abs(diffY) > Math.abs(diffX)) {
        // 此情况判断为竖向滑动歌词列表
        return
      }

      if (!this.touch.moved) {
        this.touch.moved = true
      }

      let left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + diffX))

      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },

    middleTouchEnd() {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }

      let time = 300
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },

    _pad(num, n = 2) {
      let len = num.toString().length
      if (len < n) {
        num = '0' + num
      }
      return num
    },

    _getSongUrl() {
      this.currentSong
        .getSongUrl()
        .then(url => {
          if (this.currentSong.url !== url) {
            return
          }
          this.songUrl = url
        })
        .catch(() => {
          this.songUrl = ''
        })
    },

    _getSongLyric() {
      this.currentSong
        .getSongLyric()
        .then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this._lyricHandle)
          if (this.playing) {
            this.currentLyric.play()
          }
        })
        .catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.curretnLineNum = 0
        })
    },

    _lyricHandle({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 6) {
        let lineEl = this.$refs.lyricLine[lineNum - 6]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },

    _getPosAndScale() {
      // 获取cd封面从左下飞向中心位置所需的参数
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

      return {
        x,
        y,
        scale
      }
    },

    ...mapActions(['savePlayHistory']),

    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    })
  },

  computed: {
    bgStyle() {
      return `background-image: url(${this.currentSong.image})`
    },

    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },

    miniPlayIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },

    cdRotateCls() {
      return this.playing ? 'play' : 'play pause'
    },

    disableCls() {
      return this.songReady ? '' : 'disable'
    },

    percent() {
      return this.currentTime / this.currentSong.duration
    },

    ...mapGetters(['currentIndex', 'fullScreen', 'playing'])
  },

  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLyric = null
        this.playingLyric = ''
        this.currentTime = 0
        this.currentLineNum = 0
      }
      this._getSongUrl()
      this._getSongLyric()
    },

    songUrl(newVal) {
      if (!newVal) {
        return
      }

      this.$refs.audio.src = newVal
      this.$refs.audio.play()

      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.songReady = true
      }, 5000)
    },

    playing(newVal) {
      if (!this.songUrl) {
        return
      }
      let audio = this.$refs.audio
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause()
      })
    },

    fullScreen(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.lyricList.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
@import './_player.scss';
</style>
