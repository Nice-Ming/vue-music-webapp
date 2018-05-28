<template>
	<div class="rank" ref="rank">
		<scroll class="rank-content" ref="scroll" :data="topList">
			<ul>
				<li class="rank-item" v-for="item of topList" @click="selectItem(item)">
					<div class="icon">
						<img class="icon-img" v-lazy="item.picUrl">
					</div>
					<ul class="songs">
						<li class="song" v-for="(song, index) of item.songList">
							<span>{{ index + 1 }}</span>
							<span>{{ song.songname }}-{{ song.singername }}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="loading-wrapper" v-show="!topList.length">
				<loading></loading>
			</div>	
		</scroll>
		<router-view></router-view>
	</div>
</template>

<script>
import Scroll from 'components/base/scroll/scroll'
import Loading from 'components/base/loading/loading'
import { playListMixin } from 'common/js/mixin.js'
import { getTopList } from 'api/rank.js'
import { ERR_OK } from 'api/config.js'
import { mapMutations } from 'vuex'

export default {
  name: 'Rank',
  mixins: [playListMixin],
  components: {
    Scroll,
    Loading
  },

  data() {
    return {
      topList: []
    }
  },

  created() {
    this._getTopList()
  },

  methods: {
    playListHandle(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },

    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },

    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },

    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
@import './_rank.scss';
</style>
