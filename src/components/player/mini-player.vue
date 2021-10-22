<template>
  <transition name="mini">
    <div
      class="mini-player"
      v-show="!fullScreen"
      @click="showNormalPlayer"
    >
      <!-- 旋转cd -->
      <div class="cd-wrapper">
        <div
          ref="cdRef"
          class="cd"
        >
          <img
            ref="cdImageRef"
            width="40"
            height="40"
            :src="currentSong.pic"
            :class="cdCls"
          >
        </div>
      </div>
      <!-- 歌曲信息 -->
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-group">
          <div
            class="slider-page"
            v-for="song in playList"
            :key="song.id"
          >
            <h2 class="name">{{song.name}}</h2>
            <p class="desc">{{song.singer}}</p>
          </div>
        </div>
      </div>
      <!-- 开始，暂停 -->
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <!-- 插槽使用icon 按钮 -->
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay"></i>
        </progress-circle>
      </div>
      <!-- 歌曲列表按钮 -->
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <PlayList ref="playListRef"></PlayList>
    </div>
  </transition>
</template>

<script>
  import { useStore } from 'vuex'
  import { ref, computed } from 'vue'
  import useCd from './use-cd'
  import ProgressCircle from './progress-circle'
  import useMiniSlider from './use-mini-slider'
  import PlayList from './playList'
  export default {
    name: 'mini-player',
    components: {
      ProgressCircle,
      PlayList
    },
    props: {
      progress: {
        type: Number,
        default: 0
      },
      togglePlay: Function
    },
    setup() {
      const playListRef = ref(null)
      const store = useStore()
      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)
      const playing = computed(() => store.state.playing)
      const playList = computed(() => store.state.playList)

      const { cdCls, cdRef, cdImageRef } = useCd()
      const { sliderWrapperRef } = useMiniSlider()

      const miniPlayIcon = computed(() => {
        return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
      })

      // 全屏显示
      function showNormalPlayer() {
          store.commit('setFullScreen', true)
      }
      // 显示播放列表
      function showPlayList() {
        playListRef.value.show()
      }

      return {
        fullScreen,
        currentSong,
        showNormalPlayer,
        miniPlayIcon,
        playList,
        showPlayList,
        playListRef,
        // cd
        cdCls,
        cdRef,
        cdImageRef,
        // use-mini-slider
        sliderWrapperRef
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    .cd-wrapper {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      .cd {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
          &.playing {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }
    .slider-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-page {
          display: inline-block;
          width: 100%;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          .name {
            margin-bottom: 2px;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text;
          }
          .desc {
            @include no-wrap();
            font-size: $font-size-small;
            color: $color-text-d;
          }
        }
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-playlist {
        position: relative;
        top: -2px;
        font-size: 28px;
        color: $color-theme-d;
      }
      .icon-mini {
        position: absolute;
        left: 0;
        top: 0;
        color: $color-theme-d;
        font-size: 32px;
      }
    }
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
    }
    &.mini-enter-from, &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 100%, 0)
    }
  }
</style>
