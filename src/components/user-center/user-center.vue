<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back-btn" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="list-scroll"
                ref="favoriteList"
                v-if="currentIndex === 0"
                :data="favoriteList"
          >
            <div class="list-inner">
              <song-list :songs="favoriteList" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll"
                  ref="playList"
                  v-if="currentIndex === 1"
                  :data="playHistory"
          >
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :prompt="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from 'components/base/scroll/scroll'
import Switches from 'components/base/switches/switches'
import SongList from 'components/base/song-list/song-list'
import NoResult from 'components/base/no-result/no-result'
import Song from 'common/js/song.js'
import { playListMixin } from 'common/js/mixin.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserCenter',
  mixins: [playListMixin],
  components: {
    Scroll,
    Switches,
    SongList,
    NoResult
  },

  data() {
    return {
      currentIndex: 0,
      switches: [{ name: '我喜欢的' }, { name: '最近听的' }]
    }
  },

  methods: {
    playListHandle(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },

    back() {
      this.$router.back()
    },

    switchItem(index) {
      this.currentIndex = index
    },

    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory

      if (list.length === 0) {
        return
      }

      list = list.map(song => new Song(song))
      this.randomPlay({ list })
    },

    selectSong(song) {
      this.insertSong(new Song(song))
    },

    ...mapActions(['insertSong', 'randomPlay'])
  },

  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },

    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      }
      return '你还没有听过歌曲'
    },

    ...mapGetters(['playHistory', 'favoriteList'])
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_user-center.scss';
</style>