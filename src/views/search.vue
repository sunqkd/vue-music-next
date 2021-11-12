<template>
    <div class="search">
        <div class="search-input-wrapper">
            <search-input v-model="query"></search-input>
        </div>
        <!-- 如果组件经常切换，使用v-show性能要好于v-if v-if 每次切换组件都要重新渲染一下 -->
        <div class="search-content" v-show="!query">
            <!-- 热门搜索 -->
            <div class="hot-keys">
                <h1 class="title">热门搜索</h1>
                <ul>
                    <li
                        class="item"
                        v-for="item in hotKeys"
                        :key="item.id"
                        @click="addQuery(item.key)"
                    >
                        <span>{{item.key}}</span>
                    </li>
                </ul>
            </div>
            <!-- 搜索历史 -->
            <div class="search-history" v-show="searchHistory.length">
                <h1 class="title">
                    <span class="text">搜索历史</span>
                </h1>
                <search-list
                    :searches="searchHistory"
                ></search-list>
            </div>
        </div>
        <!-- 请求搜索结果 -->
        <div class="search-result" v-show="query">
            <suggest
              :query="query"
              @select-song="selectSong"
              @select-singer="selectSinger">
            </suggest>
        </div>
        <!-- 歌手详情二级路由 -->
        <router-view v-slot="{ Component }">
            <transition appear name="slide">
                <component :is="Component" :singer="selectedSinger"/>
            </transition>
        </router-view>
    </div>
</template>
<script>
import searchInput from '@/components/search/search-input'
import searchList from '@/components/search/search-list'
import suggest from '@/components/search/suggest'
import useSearchHistory from '@/components/search/use-search-history'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import { ref, watch, computed } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'search',
    components: {
        searchInput,
        suggest,
        searchList
    },
    setup() {
        const query = ref('')
        const hotKeys = ref([])
        const store = useStore()
        const selectedSinger = ref(null)
        const router = useRouter()
        // 搜索历史
        const searchHistory = computed(() => store.state.searchHistory)
        // 保存记录方法
        const { saveSearch } = useSearchHistory()

        watch(query, (val) => {
            console.log(val)
        })

        getHotKeys().then((result) => {
            hotKeys.value = result.hotKeys
        })
        // 热门搜索
        function addQuery(s) {
            query.value = s
        }
        // 点击搜索到的歌曲(保存到搜索历史)
        function selectSong(song) {
            // 保存记录
            saveSearch(query.value)
            store.dispatch('addSong', song)
        }
        // 点击搜索得到的歌手(保存到搜索历史)
        function selectSinger(singer) {
            // 保存记录
            saveSearch(query.value)
            // 歌手详情页同样作为搜索的二级路由使用
            selectedSinger.value = singer
            cacheSinger(singer)
            router.push({
                path: `/search/${singer.mid}`
            })
        }
        // 缓存处理
        function cacheSinger(singer) {
            storage.session.set(SINGER_KEY, singer)
        }

        return {
            query,
            hotKeys,
            addQuery,
            selectSong,
            selectSinger,
            selectedSinger,
            searchHistory
        }
    }
}
</script>
<style lang="scss" scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
    .search-content {
      flex: 1;
      overflow: hidden;
      .hot-keys {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
    .search-result {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
