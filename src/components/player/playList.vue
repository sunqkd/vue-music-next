<template>
<!-- teleport 指定dom渲染位置，此处为渲染到body下面 -->
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playList"
        v-show="visible && playList.length"
        @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <!-- 播放模式 -->
          <div class="list-header">
            <h1 class="title">
              <i
                class="icon"
                :class="modeIcon"
                @click="changeMode"
              ></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <!-- 列表 -->
          <scroll
            ref="scrollRef"
            class="list-content"
          >
            <!-- <transition-group
              ref="listRef"
              name="list"
              tag="ul"
            > -->
            <ul ref="listRef">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="sclectItem(song)"
              >
                <i
                  class="current"
                  :class="getCurrentIcon(song)"
                ></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </ul>
            <!-- </transition-group> -->
          </scroll>
          <!-- 添加按钮 -->
          <div class="list-add">
            <div class="add">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <!-- 关闭按钮 -->
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <!-- 弹出框 -->
        <!-- <confirm
          ref="confirmRef"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
        ></confirm>
        <add-song ref="addSongRef"></add-song> -->
      </div>
    </transition>
  </teleport>
</template>

<script>
  import Scroll from '@/components/base/scroll/scroll'
  import { ref, computed, nextTick, watch } from 'vue'
  import { useStore } from 'vuex'
  import useMode from './use-mode'
  import useFavorite from './use-favorite'

  export default {
    name: 'playList',
    components: {
      Scroll
    },
    setup() {
      // data
      const visible = ref(false)
      const scrollRef = ref(null)
      const listRef = ref(null)
      // vuex
      const store = useStore()
      const playList = computed(() => store.state.playList)
      const sequenceList = computed(() => store.state.sequenceList)
      const currentSong = computed(() => store.getters.currentSong)
      // hook
      const { modeIcon, modeText, changeMode } = useMode()
      const { getFavoriteIcon, toggleFavorite } = useFavorite()

      // 点击歌曲或者歌曲播放完成，触发滚动
      watch(currentSong, async() => {
        if (!visible.value) {
          return
        }
        // 歌曲列表可能增加或者减少
        await nextTick()
        scrollToCurrent()
      })
      // 显示歌曲列表
      async function show() {
        visible.value = true // 数据变化dom尚未更新
        // dom更新之后，再去重新计算高度
        await nextTick()
        refreshScroll()
        // 滚动到当前歌曲
        scrollToCurrent()
      }
      // 隐藏歌曲列表
      function hide() {
        visible.value = false
      }
      // 当前播放
      function getCurrentIcon(song) {
        if (song.id === currentSong.value.id) {
          return 'icon-play'
        }
      }
      // 页面尚未渲染，刷新scroll组件，重新计算高度
      function refreshScroll() {
        scrollRef.value.scroll.refresh()
      }
      // 滚动到当前播放歌曲
      function scrollToCurrent() {
        const index = sequenceList.value.findIndex((song) => {
          return currentSong.value.id === song.id
        })
        // 当前歌曲的dom节点
        const target = listRef.value.children[index]
        scrollRef.value.scroll.scrollToElement(target, 300)
      }
      // 选中一首歌
      function sclectItem(song) {
        // currentSong是根据playlist计算出来的，
        const index = playList.value.findIndex((item) => {
          return song.id === item.id
        })
        // 提交mutations 更改当前播放索引
        store.commit('setCurrentIndex', index)
        // 更改播放状态
        store.commit('setPlayingState', true)
      }

      return {
        visible,
        playList,
        sequenceList,
        show,
        hide,
        getCurrentIcon,
        scrollRef,
        listRef,
        sclectItem,
        // mode
        modeIcon,
        modeText,
        changeMode,
        // favorite
        getFavoriteIcon,
        toggleFavorite
      }
    }
  }
</script>

<style lang="scss" scoped>
  .playList {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
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
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }
      .list-add {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
