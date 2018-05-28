<template>
	<div class="app-header">
		<div class="logo">
			<!-- <i class="iconfont iconfont-yinlemusic170"></i> -->
		</div>
		<h1 class="title">Nice Music</h1>
		<router-link tag="div" class="mine" to="/user">
			<i class="icon-mine"></i>
		</router-link>
	</div>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_app-header.scss';
</style>
