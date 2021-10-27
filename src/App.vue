<template>
  <!-- header组件 -->
  <m-header></m-header>
  <!-- tab组件 -->
  <Tab></Tab>
  <!-- 路由试图 -->
  <router-view :style="viewStyle"></router-view>
  <!-- 播放器组件：vuex状态控制 -->
  <player></player>
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player.vue'
import { mapState } from 'vuex'
export default {
  name: 'app',
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    viewStyle() {
      const bottom = this.playList.length ? '60px' : '0px'
      return {
        bottom
      }
    },
    ...mapState(['playList'])
  }
}
</script>
