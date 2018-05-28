<template>
  <scroll class="suggest"
          ref="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
          @scrollToEnd="searchMore"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item of result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" prompt=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!result.length && !hasMore">
      <no-result prompt="抱歉, 暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'components/base/scroll/scroll'
import Loading from 'components/base/loading/loading'
import NoResult from 'components/base/no-result/no-result'
import Singer from 'common/js/singer.js'
import { createSong } from 'common/js/song.js'
import { search } from 'api/search.js'
import { ERR_OK } from 'api/config.js'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  name: 'Suggest',
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      result: [],
      page: 1,
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },

  methods: {
    refresh() {
      this.$refs.suggest.refresh()
    },

    listScroll() {
      this.$emit('listScroll')
    },

    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      }
      return 'icon-music'
    },

    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      }
      return `${item.name}-${item.singer}`
    },

    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id: item.singermid,
          name: item.singename
        })
        this.setSinger(singer)
        this.$router.push({
          path: `/search/${singer.id}`
        })
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },

    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }
      })
    },

    _search() {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },

    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },

    _normalizeSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },

    _checkMore(data) {
      let song = data.song
      if (!song.list.length || song.curnum * song.curpage >= song.totalnum) {
        this.hasMore = false
      }
    },

    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),

    ...mapActions(['insertSong'])
  },

  watch: {
    query(newVal) {
      if (!newVal) {
        this.result.length = 0
        this.hasMore = false
        return
      }
      this._search()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
@import './_suggest.scss';
</style>