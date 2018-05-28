<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h2 class="title">
            <i class="icon" :class="modeIcon" @click="changePlayMode"></i>
            <span class="text">{{ modeText }}</span>
            <i class="icon-clear" @click="showConfirm"></i>
          </h2>
        </div>
        <scroll class="list-content"
                ref="listContent"
                :data="sequenceList"
                :refreshDelay="refreshDelay"
        >
          <transition-group tag="ul" ref="list" name="list">
            <li class="item"
                v-for="(item, index) of sequenceList"
                :key="item.id"
                @click="selectItem(item, index)"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text"> {{ item.name }}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm"
               promptText="是否清空播放列表"
               confirmBtnText="清空"
               @confirm="confirmClear"
      ></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import Scroll from 'components/base/scroll/scroll'
import Confirm from 'components/base/confirm/confirm'
import AddSong from 'components/add-song/add-song'
import { mapActions } from 'vuex'
import { playMode } from 'common/js/config.js'
import { playerMixin } from 'common/js/mixin.js'

export default {
  name: 'Playlist',
  mixins: [playerMixin],
  components: {
    Scroll,
    Confirm,
    AddSong
  },

  data() {
    return {
      showFlag: false,
      refreshDelay: 120
    }
  },

  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        // DOM切换显示状态时需要重新计算高度
        // 设置延时刷新scroll组件
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },

    hide() {
      this.showFlag = false
    },

    getCurrentIcon(item) {
      if (item.id === this.currentSong.id) {
        return 'icon-play'
      }
      return ''
    },

    showConfirm() {
      this.$refs.confirm.show()
    },

    confirmClear() {
      this.clearPlayList()
    },

    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex(song => song.id === item.id)
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },

    deleteOne(item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },

    addSong() {
      this.$refs.addSong.show()
    },

    scrollToCurrent(current) {
      let index = this.sequenceList.findIndex(item => item.id === current.id)
      this.$refs.listContent.scrollToElement(
        this.$refs.list.$el.children[index],
        300
      )
    },

    ...mapActions(['deleteSong', 'clearPlayList'])
  },

  computed: {
    modeText() {
      return this.mode === playMode.sequence
        ? '顺序播放'
        : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },

  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      setTimeout(() => {
        this.scrollToCurrent(newSong)
      }, 20)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
@import './_playlist.scss';
</style>