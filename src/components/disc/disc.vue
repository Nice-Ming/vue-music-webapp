<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list> 
  </transition>
</template>

<script>
import MusicList from 'components/music-list//music-list'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
import { createSong } from 'common/js/song.js'

export default {
  name: 'Disc',
  components: {
    MusicList
  },

  data() {
    return {
      songs: []
    }
  },

  created() {
    this._getSongList()
  },

  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.back()
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },

    _normalizeSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })

      return ret
    }
  },

  computed: {
    title() {
      return this.disc.dissname
    },

    bgImage() {
      return this.disc.imgurl
    },

    ...mapGetters(['disc'])
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