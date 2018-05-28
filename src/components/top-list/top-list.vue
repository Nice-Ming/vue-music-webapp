<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { getMusicList } from 'api/rank.js'
import { ERR_OK } from 'api/config.js'
import { createSong } from 'common/js/song.js'
import { mapGetters } from 'vuex'

export default {
  name: 'TopList',
  components: {
    MusicList
  },

  data() {
    return {
      rank: true,
      songs: []
    }
  },

  created() {
    this._getMusicList()
  },

  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.back()
        return
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },

    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let musicData = item.data
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },

  computed: {
    title() {
      return this.topList.topTitle
    },

    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
    },

    ...mapGetters(['topList'])
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>