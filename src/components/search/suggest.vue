<template>
    <div
        class="suggest"
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
        </ul>
    </div>
</template>

<script>
    import { ref } from 'vue'
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
            // props.query 为一个字符串，并不是响应式。可以通过get函数监听
            watch(() => props.query,(newQuery)=>{
                
            })
            return {
                singer,
                songs,
                hasMore
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
