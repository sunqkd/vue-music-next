<template>
  <m-header></m-header>
</template>

<script>
import Header from '@/components/header/header'
export default {
  data() {
    return {
      msg: '123'
    }
  },
  components: {
    MHeader: Header
  }
}
</script>
