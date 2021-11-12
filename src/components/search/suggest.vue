<template>
    <div
        ref="rootRef"
        class="suggest"
        v-loading:[loadingText]="loading"
        v-no-result:[noResultText]="noResult"
    >
        <ul class="suggest-list">
            <li
                class="suggest-item"
                v-if="singer"
            >
                <div class="icon">
                    <i class="icon-mine"></i>
                </div>
                <div class="name">
                    <p class="text">{{ singer.name }}</p>
                </div>
            </li>
            <li
                class="suggest-item"
                v-for="song in songs"
                :key="song.id"
            >
                <div class="icon">
                    <i class="icon-music"></i>
                </div>
                <div class="name">
                    <p class="text">
                        {{song.singer}}-{{song.name}}
                    </p>
                </div>
            </li>
            <div class="suggest-item"
                v-loading:[loadingText]="pullUpLoading">
            </div>
        </ul>
    </div>
</template>

<script>
    import { ref, watch, computed, nextTick } from 'vue'
    import { search } from '@/service/search'
    import { processSongs } from '@/service/song'
    import usePullUpLoad from './use-pull-up-load'
    export default {
        name: 'suggest',
        props: {
            query: String,
            // 是否显示歌手
            showSinger: {
                type: Boolean,
                default: true
            }
        },
        setup(props) {
            // 歌手 歌曲 是否还有更多
            const singer = ref(null)
            const songs = ref([])
            const hasMore = ref(true)
            const page = ref(1)
            const loadingText = ref('')
            const noResultText = ref('抱歉，暂无搜索结果')
            // 是否需要加载满屏标志位
            const manualLoading = ref(false)
            // 上拉加载loading
            const pullUpLoading = computed(() => {
                return isPullUpLoad.value && hasMore.value
            })

            const noResult = computed(() => {
                return !singer.value && !songs.value.length && !hasMore.value
            })
            const loading = computed(() => {
                return !singer.value && !songs.value.length
            })

            // 是否允许上拉加载
            // 1、首次请求禁止上拉加载功能 loading
            // 2、不满屏，需要请求满屏的时候，禁止上拉加载功能 manualLoading
            const preventPullUpLoad = computed(() => {
                return loading.value || manualLoading.value
            })

            const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(searchMore, preventPullUpLoad)

            // props.query 为一个字符串，并不是响应式。可以通过get函数监听
            watch(() => props.query, async (newQuery) => {
                if (!newQuery) {

                } else {
                    // 执行搜索操作
                    await searchFirst()
                }
            })
            // 初始加载
            // 首次请求，禁止上拉加载功能
            async function searchFirst() {
                if (!props.query) {
                    return
                }
                // 初始化
                page.value = 1
                songs.value = []
                singer.value = null
                hasMore.value = true
                // 获取搜索结果
                const result = await search(props.query, page.value, props.showSinger)
                // 给歌曲添加url链接
                songs.value = await processSongs(result.songs)
                singer.value = result.singer
                hasMore.value = result.hasMore
                // 需要在数据渲染之后
                await nextTick()
                await makeItScrollable()
            }
            // 加载更多
            async function searchMore() {
                // 没有数据了停止加载
                if (!hasMore.value || !props.query) {
                    return
                }
                page.value++
                const result = await search(props.query, page.value, props.showSinger)
                songs.value = songs.value.concat(await processSongs(result.songs))
                hasMore.value = result.hasMore
                await nextTick()
                await makeItScrollable()
            }
            // 加载到可重评
            // 此过程也不允许，执行上拉加载动作
            async function makeItScrollable() {
                // maxScrollY 最大纵向滚动位置，并且maxScrollY是负值
                // 不满足一屏 判断
                if (scroll.value.maxScrollY >= -1) {
                    manualLoading.value = true
                    await searchMore()
                    manualLoading.value = false
                }
                // 满足一屏则停止
            }

            return {
                singer,
                songs,
                loadingText,
                noResult,
                loading,
                noResultText,
                pullUpLoading,
                // pullup
                rootRef,
                isPullUpLoad
            }
        }
    }
</script>

<style lang="scss" scoped>
  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
