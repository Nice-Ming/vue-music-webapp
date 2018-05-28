<template>
	<div class="song-list">
		<ul>
			<li class="song-item" v-for="(song, index) of songs" @click="selectItem(song, index)">
				<div class="rank" v-show="rank">
					<span :class="getRankCls(index)">{{ getRankText(index) }}</span>
				</div>
				<div class="content">
					<h2 class="name">{{ song.name }}</h2>
					<p class="desc">{{ getDesc(song) }}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      }
      return 'text'
    },

    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    },

    getDesc(song) {
      return `${song.singer}·${song.album}`
    },

    selectItem(item, index) {
      this.$emit('select', item, index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
@import './_song-list.scss';
</style>
