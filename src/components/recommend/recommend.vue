<template>
	<div class="recommend" ref="recommend">
		<scroll class="recommend-content" ref="scroll" :data="discList">
			<div>
				<div class="slider-wrapper" v-if="recommends.length">
					<slider>
						<div v-for="item of recommends">
							<a :href="item.linkUrl">
								<img class="needsclick" @load="loadImage" :src="item.picUrl">
							</a>
						</div>
					</slider>
				</div>
				<div class="recommend-list">
					<p class="list-title">热门歌单推荐</p>
					<ul>
						<li class="list-item" v-for="item of discList" @click="selectItem(item)">
							<div class="icon">
								<img v-lazy="item.imgurl">
							</div>
							<div class="text">
								<h2 class="name" v-html="item.creator.name"></h2>
								<p class="desc" v-html="item.dissname"></p>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="loading-wrapper" v-show="!discList.length">
				<loading></loading>
			</div>
		</scroll>
    <router-view></router-view>
	</div>
</template>

<script>
import Scroll from 'components/base/scroll/scroll'
import Slider from 'components/slider/slider'
import Loading from 'components/base/loading/loading'
import { getRecommend, getDiscList } from 'api/recommend.js'
import { playListMixin } from 'common/js/mixin.js'
import { mapMutations } from 'vuex'
import { ERR_OK } from 'api/config.js'

export default {
  name: 'Recommend',
  mixins: [playListMixin],
  components: {
    Scroll,
    Slider,
    Loading
  },

  data() {
    return {
      recommends: [],
      discList: []
    }
  },

  created() {
    this._getRecommend()
    this._getDiscList()
  },

  methods: {
    playListHandle(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },

    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },

    loadImage() {
      if (!this.checkLoaded) {
        this.checkLoaded = true
        this.$refs.scroll.refresh()
      }
    },

    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },

    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },

    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_recommend.scss';
</style>
