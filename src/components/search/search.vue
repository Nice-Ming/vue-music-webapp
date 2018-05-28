<template>
	<div class="search">
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div class="shortcut-wrapper" ref="shortcurWrapper" v-show="!query">
			<scroll class="shortcut"
              ref="shortcut"
              :data="shortcut"
              :refreshDelay="refreshDelay"
      >
        <div>
          <div class="hot-key">
            <h2 class="title">热门搜索</h2>
            <ul>
              <li class="item" v-for="item of hotKey" @click="addQuery(item.k)">{{ item.k }}</li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
              <h2 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <i class="icon-clear"></i>
                </span>
              </h2>
              <search-list :searches="searchHistory" @delete="deleteSearchHistory" @select="addQuery"></search-list>
          </div>
        </div>
			</scroll>
		</div>
		<div class="search-result" ref="searchResult" v-show="query">
			<suggest ref="suggest"
							 :query="query"
							 @listScroll="blurInput"
							 @select="saveSearch"
			></suggest>
		</div>
    <confirm ref="confirm"
             promptText="是否清空所有搜索历史"
             confirmBtnText="清空"
             @confirm="clearSearchHistory"
    ></confirm>
  	<router-view></router-view>
	</div>
</template>

<script>
import Scroll from 'components/base/scroll/scroll'
import SearchBox from 'components/base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'components/base/search-list/search-list'
import Confirm from 'components/base/confirm/confirm'
import { mapActions, mapGetters } from 'vuex'
import { getHotKey } from 'api/search.js'
import { ERR_OK } from 'api/config.js'
import { playListMixin, searchMixin } from 'common/js/mixin.js'

export default {
  name: 'Search',
  mixins: [playListMixin, searchMixin],
  components: {
    Scroll,
    SearchBox,
    Suggest,
    SearchList,
    Confirm
  },
  data() {
    return {
      hotKey: []
    }
  },

  created() {
    this._getHotKey()
  },

  methods: {
    playListHandle(playList) {
      let bottom = playList.length ? '60px' : ''

      this.$refs.shortcurWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },

    showConfirm() {
      this.$refs.confirm.show()
    },

    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },

    ...mapActions(['clearSearchHistory'])
  },

  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },

  watch: {
    query(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
@import './_search.scss';
</style>
