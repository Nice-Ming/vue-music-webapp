<template>
	<div class="singer" ref="singer">
		<list-view :data="singers" @select="selectSinger" ref="listview"></list-view>
		<router-view></router-view>
	</div>
</template>

<script>
import ListView from 'components/listview/listview'
import Singer from 'common/js/singer.js'
import { getSingerList } from 'api/singer.js'
import { ERR_OK } from 'api/config.js'
import { mapMutations } from 'vuex'
import { playListMixin } from 'common/js/mixin.js'

const HOT_SINGERS_LEN = 10
const HOT_TITLE = '热门'

export default {
  name: 'Singer',
  mixins: [playListMixin],
  components: {
    ListView
  },
  data() {
    return {
      singers: []
    }
  },

  created() {
    this._getSingerList()
  },

  methods: {
    playListHandle(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.listview.refresh()
    },

    selectSinger(singer) {
      this.$router.push({ path: `/singer/${singer.id}` })
      this.setSinger(singer)
    },

    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSingerList(res.data.list)
        }
      })
    },

    _normalizeSingerList(list) {
      let map = {
        hot: {
          title: HOT_TITLE,
          items: []
        }
      }

      list.forEach((item, index) => {
        if (index < HOT_SINGERS_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          )
        }

        let key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }

        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        )
      })

      // 目前的map是个对象 渲染时需要有序列表 所以还需要处理下map
      let hot = []
      let other = []

      for (let key in map) {
        let item = map[key]
        if (item.title.match(/[a-zA-Z]/)) {
          other.push(item)
        } else if (item.title === HOT_TITLE) {
          hot.push(item)
        }
      }

      // 按照A-Z顺序排列
      other.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      return hot.concat(other)
    },

    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>

