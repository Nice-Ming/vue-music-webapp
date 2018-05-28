<template>
	<div class="loading">
		<img class="gif" src="./loading.gif">
		<p class="prompt">{{ prompt }}</p>
	</div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    prompt: {
      type: String,
      default: '拼命加载中...'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_loading.scss';
</style>
