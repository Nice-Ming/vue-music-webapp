<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" ref="queryBox" v-model="query" :placeholder="placeholder">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from 'common/js/util.js'

export default {
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },

  created() {
    // debounce()是一个节流函数
    // 每次调用后在200ms内看是否还会继续调用
    // 若超过延时时间则调用参数中的回掉函数
    this.$watch(
      'query',
      debounce(newVal => {
        this.$emit('query', newVal)
      }, 200)
    )
  },

  methods: {
    clear() {
      this.query = ''
    },

    blur() {
      this.$refs.queryBox.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_search-box.scss';
</style>