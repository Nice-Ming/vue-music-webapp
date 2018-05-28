<template>
  <div class="no-result">
    <p class="no-result-text">{{ prompt }}</p>
  </div>
</template>

<script>
export default {
  name: 'NoResult',
  props: {
    prompt: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_no-result.scss';
</style>