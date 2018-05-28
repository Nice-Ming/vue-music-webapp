<template>
  <div id="app" @touchmove.prevent>
    <app-header></app-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import AppHeader from 'components/app-header/app-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  name: 'App',
  components: {
    AppHeader,
    Tab,
    Player
  }
}
</script>

<style></style>
