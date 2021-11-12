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
        </div>
        <!-- 请求搜索结果 -->
        <div class="search-result" v-show="query">
            <suggest
              :query="query"
              @select-song="selectSong">
            </suggest>
        </div>
    </div>
</template>
<script>
import searchInput from '@/components/search/search-input'
import suggest from '@/components/search/suggest'
import { ref, watch } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
export default {
    name: 'search',
    components: {
        searchInput,
        suggest
    },
    setup() {
        const query = ref('')
        const hotKeys = ref([])
        const store = useStore()

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
        // 点击搜索的歌曲
        function selectSong(song) {
            store.dispatch('addSong', song)
        }
        return {
            query,
            hotKeys,
            addQuery,
            selectSong
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
