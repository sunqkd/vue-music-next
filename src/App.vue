<template>
  <!-- header组件 -->
  <m-header></m-header>
  <!-- tab组件 -->
  <Tab></Tab>
  <router-view></router-view>
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'

export default {
  name: 'app',
  components: {
    MHeader: Header,
    Tab
  }
}
</script>
