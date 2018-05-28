import { mapGetters, mapActions, mapMutations } from 'vuex'
import { playMode } from './config.js'
import { shuffle } from './util.js'

export const playListMixin = {
  mounted() {
    this.playListHandle(this.playList)
  },
  activated() {
    this.playListHandle(this.playList)
  },
  methods: {
    playListHandle() {
      throw new Error('component must implement handlePlaylist method')
    }
  },
  computed: {
    ...mapGetters(['playList'])
  },
  watch: {
    playList(newVal) {
      this.playListHandle(newVal)
    }
  }
}

export const playerMixin = {
  methods: {
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },

    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },

    isFavorite(song) {
      let index = this.favoriteList.findIndex(item => item.id === song.id)
      return index > -1
    },

    changePlayMode() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null

      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }

      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },

    _resetCurrentIndex(list) {
      let index = list.findIndex(item => item.id === this.currentSong.id)
      this.setCurrentIndex(index)
    },

    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),

    ...mapActions(['saveFavoriteList', 'deleteFavoriteList'])
  },

  computed: {
    modeIcon() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop
          ? 'icon-loop'
          : 'icon-random'
    },

    ...mapGetters([
      'currentSong',
      'sequenceList',
      'playList',
      'mode',
      'favoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },

  methods: {
    addQuery(query) {
      this.$refs.searchBox.query = query
    },

    onQueryChange(query) {
      this.query = query
    },

    blurInput() {
      this.$refs.searchBox.blur()
    },

    saveSearch() {
      this.saveSearchHistory(this.query)
    },

    ...mapActions(['saveSearchHistory', 'deleteSearchHistory'])
  },

  computed: {
    ...mapGetters(['searchHistory'])
  }
}
