<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li class="search-item"
          v-for="item of searches"
          :key="item" 
          @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },

    deleteItem(item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
@import './_search-list.scss';
</style>