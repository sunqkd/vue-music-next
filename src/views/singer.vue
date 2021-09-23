<template>
    <div class="singer" v-loading="!singers.length">
        <IndexList :data="singers" @select="selectSinger"></IndexList>
        <router-view :singer="selectedSinger"></router-view>
    </div>
</template>
<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
    name: 'singer',
    components: {
        IndexList
    },
    data() {
        return {
            singers: [], // 歌手列表数据
            selectedSinger: null // 歌手详情数据 data里面的数据就是响应式数据
        }
    },
    async created() {
        const result = await getSingerList()
        this.singers = result.singers
    },
    methods: {
        // 接受子组件传递过来的数据
        selectSinger(singer) {
            this.selectedSinger = singer
            // 在此处存储 singer
            this.cacheSinger(singer)
            this.$router.push({
                path: `/singer/${singer.mid}`
            })
        },
        // 缓存singer
        cacheSinger(singer) {
            storage.session.set(SINGER_KEY, singer)
        }
    }
}
</script>
<style lang="scss" scoped>
    .singer{
        position:fixed;
        width:100%;
        top:88px;
        bottom:0
    }
</style>
