<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h2 class="title">添加歌曲到列表</h2>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll class="list-scroll"
                  ref="songList"
                  v-if="currentIndex === 0"
                  :data="playHistory"
          >
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll"
                  ref="searchList"
                  v-if="currentIndex === 1"
                  :data="searchHistory"
                  :refreshDelay="refreshDelay"
          >
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query"
                 :showSinger="showSinger"
							   @listScroll="blurInput"
							   @select="saveSearch"
        ></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'components/base/search-box/search-box'
import Switches from 'components/base/switches/switches'
import Suggest from 'components/suggest/suggest'
import Scroll from 'components/base/scroll/scroll'
import SongList from 'components/base/song-list/song-list'
import SearchList from 'components/base/search-list/search-list'
import TopTip from 'components/base/top-tip/top-tip'
import Song from 'common/js/song.js'
import { mapGetters, mapActions } from 'vuex'
import { searchMixin } from 'common/js/mixin.js'

export default {
  name: 'AddSong',
  mixins: [searchMixin],
  components: {
    SearchBox,
    Switches,
    Suggest,
    Scroll,
    SongList,
    SearchList,
    TopTip
  },
  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [{ name: '最近播放' }, { name: '搜索历史' }]
    }
  },

  methods: {
    show() {
      this.showFlag = true

      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },

    hide() {
      this.showFlag = false
    },

    switchItem(index) {
      this.currentIndex = index
    },

    selectSuggest() {
      this.saveSearch()
      this.showTip()
    },

    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.showTip()
      }
    },

    showTip() {
      this.$refs.topTip.show()
    },

    ...mapActions(['insertSong'])
  },

  computed: {
    ...mapGetters(['playHistory', 'searchHistory'])
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
@import './_add-song.scss';
</style>
