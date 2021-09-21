<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="title" :loading="loading"></music-list>
  </div>
</template>
<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list'
export default {
    name: 'singer-detail',
    components: {
      MusicList
    },
    // 用于获取歌手详情
    props: {
      singer: Object // 包含歌手图片和id等
    },
    data() {
      return {
        songs: [], // 歌曲列表
        loading: true // 向子组件传递loading
      }
    },
    computed: {
      pic() { // 歌手图片
        return this.singer && this.singer.pic
      },
      title() { // 标题
        return this.singer && this.singer.name
      }
    },
    async created() {
        // 获取 歌手详情 和 歌曲url接口
        const result = await getSingerDetail(this.singer)
        const songs = await processSongs(result.songs)
        this.songs = songs
        this.loading = false
    }
}
</script>
<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
