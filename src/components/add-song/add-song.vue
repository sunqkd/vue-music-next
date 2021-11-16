<template>
    <!-- teleport 把组件直接挂在到body上 -->
    <teleport to="body">
        <transition name="slide">
            <div class="add-song" v-show="visible">
                <div class="header">
                    <h1 class="title">添加歌曲到列表</h1>
                    <div class="close" @click="hide">
                        <i class="icon-close"></i>
                    </div>
                </div>
                <div class="search-input-wrapper">
                    <!-- 搜索歌曲，不支持搜索歌手 -->
                    <search-input
                        v-model="query"
                        placeholder="搜索歌曲"
                    ></search-input>
                </div>
                <div v-show="!query">
                    <!-- 切换按钮 -->
                    <switches
                        :items="['最近播放', '搜索历史']"
                        v-model="currentIndex"
                    ></switches>
                    <div class="list-wrapper">
                        <!-- 最近播放 -->
                        <!-- 同一时间，只能渲染一个（v-if），所以可以使用同名字的ref -->
                        <scroll
                            v-if="currentIndex === 0"
                            class="list-scroll"
                            ref="scrollRef"
                        >
                            <div class="list-inner">
                                <song-list
                                    :songs="playHistory"
                                    @select="selectSongBySongList"
                                >
                                </song-list>
                            </div>
                        </scroll>
                        <!-- 搜索历史 -->
                        <scroll
                            v-if="currentIndex===1"
                            class="list-scroll"
                            ref="scrollRef"
                        >
                            <div class="list-inner">
                                <search-list
                                    :searches="searchHistory"
                                    :show-delete="false"
                                    @select="addQuery"
                                ></search-list>
                            </div>
                        </scroll>
                    </div>
                </div>
                <div class="search-result" v-show="query">
                    <!-- 搜索结果 -->
                    <suggest
                        :query="query"
                        :show-singer="false"
                        @select-song="selectSongBySuggest"
                    >
                    </suggest>
                </div>
                <!-- <message ref="messageRef">
                    <div class="message-title">
                        <i class="icon-ok"></i>
                        <span class="text">1首歌曲已经添加到播放列表</span>
                    </div>
                </message> -->
            </div>
        </transition>
    </teleport>
</template>
<script>
    import SearchInput from '@/components/search/search-input'
    import Suggest from '@/components/search/suggest'
    import Switches from '@/components/switches/switches'
    import Scroll from '@/components/base/scroll/scroll'
    import SongList from '@/components/base/song-list/song-list'
    import SearchList from '@/components/base/search-list/search-list'
    import useSearchHistory from '@/components/search/use-search-history'

    import { ref, computed, nextTick, watch } from 'vue'
    import { useStore } from 'vuex'

    export default {
        name: 'add-song',
        components: {
            SearchInput,
            Suggest,
            Switches,
            Scroll,
            SongList,
            SearchList
        },
        setup() {
            // 组件显示
            const visible = ref(false)
            // 搜索字段
            const query = ref('')
            const currentIndex = ref(0)
            // 用于滚动刷新
            const scrollRef = ref(null)
            
            // const
            const store = useStore()
            // 搜索历史
            const searchHistory = computed(() => store.state.searchHistory)
            // 播放历史
            const playHistory = computed(() => store.state.playHistory)
            // 保存搜索关键字，逻辑复用
            const { saveSearch } = useSearchHistory()
            // 监听变化，重新计算高度
            watch(query, async() => {
                if (!query.value) {
                    await nextTick()
                    refreshScroll()
                }
            })
            // 显示
            async function show() {
                visible.value = true
                // 从 v-show false -> true 刷新界面
                await nextTick()
                refreshScroll()
            }
            // 刷新scroll，页面增加减少数据，重新计算高度
            function refreshScroll() {
                scrollRef.value.scroll.refresh()
            }
            // 隐藏
            function hide() {
                visible.value = false
            }
            // 搜索历史点击
            function addQuery(s) {
                query.value = s
            }
            // 播放历史点击
            function selectSongBySongList({ song }) {
                addSong(song)
            }
            // 添加歌曲
            function addSong(song) {
                store.dispatch('addSong', song)
            }
            // 搜索结果点击
            function selectSongBySuggest(song) {
                // 添加歌曲
                addSong(song)
                // 保存搜索词 query
                saveSearch(query.value)
            }

            return {
                visible,
                query,
                show,
                hide,
                currentIndex,
                searchHistory,
                playHistory,
                addQuery,
                selectSongBySongList,
                selectSongBySuggest,
                scrollRef
            }
        }
    }
</script>
<style lang="scss" scoped>
  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 300;
    background: $color-background;
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      .title {
        line-height: 44px;
        font-size: $font-size-large;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 8px;
        .icon-close {
          display: block;
          padding: 12px;
          font-size: 20px;
          color: $color-theme;
        }
      }
    }
    .search-input-wrapper {
      margin: 20px
    }
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
    .search-result {
      position: fixed;
      top: 124px;
      bottom: 0;
      width: 100%;
    }
  }

  .message-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
</style>
