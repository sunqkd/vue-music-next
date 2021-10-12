<template>
  <div class="player">
    <!-- 用v-if页面不会渲染，dom节点都不会存在；用v-show dom节点存在页面会渲染，如果出错则停止渲染，后续流程停止
    undefinded 不能调用任何属性 undefined.aa 会报错误 调用空对象{}的属性，为undefined则不会报错，undefined不会报错顶多不渲染-->
    <div
      class="normal-player"
      v-show="fullScreen"
    >
      <div class="background">
        <img :src="currentSong.pic">
      </div>
      <div class="top">
        <div
          class="back"
          @click="goBack"
        >
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{currentSong.name}}</h1>
        <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>
      <div class="bottom">
        <div class="operators">
          <!-- 播放模式 -->
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <!-- 上一首 -->
          <div class="icon i-left">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <!-- 中间按钮，决定播放和暂停 -->
          <div class="icon i-center">
            <i @click="togglePlat" :class="playIcon"></i>
          </div>
          <!-- 下一首 -->
          <div class="icon i-right">
            <i @click="next" class="icon-next"></i>
          </div>
          <!-- 收藏 -->
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- audio 属性controls="controls" 不加则不显示 -->
    <audio ref="audioRef" @pause="pause"></audio>
  </div>
</template>

<script>
  // fullScreen:全局状态，是否是全局播放
  // currentSong:当前播放歌曲，全局属性
  // useStore专门为 compositionAPI 中使用 vuex
  import { useStore } from 'vuex'
  import { computed, watch, ref } from 'vue'
  export default {
    name: 'player',
    setup() {
      // 在compositionAPI中访问不到this
      const store = useStore() // 获得vuex中store：可以获得 state、getters中的数据
      const fullScreen = computed(() => store.state.fullScreen) // 响应式数据，state中fullScreen发生变化fullScreen就可以改变
      const currentSong = computed(() => store.getters.currentSong) // 同样为响应式数据
      const currentIndex = computed(() => store.state.currentIndex) // 当前播放列表的索引
      const playList = computed(() => store.state.playList) // 当前播放列表
      // 页面没有显示之前为null，显示之后为audio DOM节点，会默认进行赋值为dom节点，双向数据绑定
      const audioRef = ref(null) // audio标签
      const playing = computed(() => store.state.playing) // 歌曲播放状态
      const playIcon = computed(() => {
        return playing.value ? 'icon-pause' : 'icon-play'
      })
      // 监听当前歌曲
      watch(currentSong, (newSong) => {
        if (!newSong.id || !newSong.url) {
          return
        }
        const audioEl = audioRef.value
        audioEl.src = newSong.url
        audioEl.play()
      })
      // 监听播放状态,进行暂停或者播放
      watch(playing, (newPlaying) => {
        const audioEl = audioRef.value
        newPlaying ? audioEl.play() : audioEl.pause()
      })
      // 取消全屏
      function goBack() {
        // 提交一个 mutation 更改 fullScreen
        store.commit('setFullScreen', false)
      }
      // 修改播放状态
      function togglePlat() {
        store.commit('setPlayingState', !playing.value) // 只更改了播放状态，并未和audio发生关联
      }
      // audio 暂停事件，非人为触发的事件
      function pause() {
        // 修改播放状态为false，
        // 不是用户触发的暂停，通过待机或者锁屏等方式触发的暂停事件，需要同步数据状态
        store.commit('setPlayingState', false)
      }
      // 上一首
      function prev() {
        const list = playList.value // 歌曲个数
        // 开发中注意边界情况保护，代码更高效
        if (!list.length) { // 没有歌曲
          return
        }
        if (list.length === 1) { // 只有一首歌,循环播放
          loop()
        } else {
          // 播放的index -1
          let index = currentIndex.value - 1
          // 循环播放 若到索引为0，则循环到列表末尾
          if (index === -1) {
            index = list.length - 1
          }
          store.commit('setCurrentIndex', index)
          // 如果是暂停状态，做上一首操作，需要更改状态，因为currentSong变化，歌曲就播放，状态未改变
          if (!playing.value) {
            store.commit('setPlayingState', true)
          }
        }
      }
      // 下一首
      function next() {
        const list = playList.value // 歌曲个数
        if (!list.length) {
          return
        }
        if (list.length === 1) {
          loop()
        } else {
          // 播放的index +1
          let index = currentIndex.value + 1
          // 循环播放 若到索引为length长度，则循环到第一首
          if (index === list.length) {
            index = 0
          }
          store.commit('setCurrentIndex', index)
          // 如果是暂停状态，做上一首操作，需要更改状态，因为currentSong变化，歌曲就播放，状态未改变
          if (!playing.value) {
            store.commit('setPlayingState', true)
          }
        }
      }
      // 如果只有一首歌，则循环播放
      function loop() {
        const audioEl = audioRef.value
        audioEl.currentTime = 0 // 歌曲时间置为零，并播放
        audioEl.play()
        // 如果是暂停状态，做上一首操作，需要更改状态，因为currentSong变化，歌曲就播放，状态未改变
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }

      return {
        audioRef,
        fullScreen,
        currentSong,
        goBack,
        playIcon,
        togglePlat,
        pause,
        prev,
        next
      }
    }
  }
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }
  }
</style>
