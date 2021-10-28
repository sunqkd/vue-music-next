<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="title" :loading="loading"></music-list>
  </div>
</template>
<script>
import { getSingerDetail } from '@/service/singer'
// import { processSongs } from '@/service/song'
// import MusicList from '@/components/music-list/music-list'
// import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'
// 参数分别为 名称，缓存名称，获取数据方法
export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)

// {
//     name: 'singer-detail',
//     components: {
//       MusicList
//     },
//     // 用于获取歌手详情
//     props: {
//       singer: Object // 包含歌手图片和id等
//     },
//     data() {
//       return {
//         songs: [], // 歌曲列表
//         loading: true // 向子组件传递loading
//       }
//     },
//     computed: {
//       // 优先使用props中的singer，如果页面刷新（路由中的singer与session中的singer相同），则使用session中的缓存数据
//       computedSinger() {
//         let ret = null
//         const singer = this.singer
//         if (singer) { // props中的数据不是空的
//           ret = singer
//         } else { // 当前页刷新
//           const cachedSinger = storage.session.get(SINGER_KEY)
//           if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
//             ret = cachedSinger
//           }
//         }
//         return ret
//       },
//       pic() { // 歌手图片
//         const singer = this.computedSinger
//         return singer && singer.pic
//       },
//       title() { // 标题
//         const singer = this.computedSinger
//         return singer && singer.name
//       }
//     },
//     async created() {
//         // 如果没有拿到数据 或者 数据不匹配 (即路由参数id随意更改情况) 处理方式 返回上一级路由
//         if (!this.computedSinger) {
//           // 返回一级路由
//           const path = this.$route.matched[0].path
//           this.$router.push({ path })
//           return
//         }
//         // 获取 歌手详情 和 歌曲url接口
//         const result = await getSingerDetail(this.computedSinger)
//         const songs = await processSongs(result.songs)
//         this.songs = songs
//         this.loading = false
//     }
// }

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
