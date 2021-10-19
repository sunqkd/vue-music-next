<template>
  <div
    class="player"
    v-show="playList.length">
    <!-- 用v-if页面不会渲染，dom节点都不会存在；用v-show dom节点存在页面会渲染，如果出错则停止渲染，后续流程停止
    undefinded 不能调用任何属性 undefined.aa 会报错误 调用空对象{}的属性，为undefined则不会报错，undefined不会报错顶多不渲染-->
    <div
      class="normal-player"
      v-show="fullScreen"
    >
      <div class="background">
        <img :src="currentSong.pic">
      </div>
      <!-- 歌手名称 -->
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
      <!-- cd旋转唱片，歌词部分 -->
      <div
        class="middle"
        @touchstart.prevent="onMiddleTouchStart"
        @touchmove.prevent="onMiddleTouchMove"
        @touchend.prevent="onMiddleTouchEnd"
      >
        <!-- cd唱片 -->
        <div class="middle-l" :style="middleLStyle">
          <div class="cd-wrapper">
            <div class="cd" ref="cdRef">
              <img class="image" ref="cdImageRef" :class="cdCls" :src="currentSong.pic">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <!-- 歌词部分 -->
        <scroll
          class="middle-r"
          ref="lyricScrollRef"
          :style="middleRStyle"
        >
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="text"
                :class="{'current': currentLineNum === index}"
                v-for="(line,index) in currentLyric.lines"
                :key="line.num"
              >
                {{line.txt}}
              </p>
            </div>
            <!-- 针对没有歌词的情况 -->
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{pureMusicLyric}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <!-- 操作按钮，进度条 -->
      <div class="bottom">
        <!-- 显示板块切换按钮 -->
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow==='cd'}"></span>
          <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
        </div>
        <!-- 进度条 -->
        <div class="progress-wrapper">
            <!-- 播放进度 -->
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <!-- 总时长 -->
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
        </div>
        <!-- 操作按钮 -->
        <div class="operators">
          <!-- 播放模式 -->
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
          </div>
          <!-- 上一首 -->
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <!-- 中间按钮，决定播放和暂停 -->
          <div class="icon i-center" :class="disableCls">
            <i @click="togglePlat" :class="playIcon"></i>
          </div>
          <!-- 下一首 -->
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <!-- 收藏 -->
          <div class="icon i-right">
            <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <mini-player></mini-player>
    <!-- audio 属性controls="controls" 不加则不显示 -->
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    >
    </audio>
  </div>
</template>

<script>
  // fullScreen:全局状态，是否是全局播放
  // currentSong:当前播放歌曲，全局属性
  // useStore专门为 compositionAPI 中使用 vuex
  import { useStore } from 'vuex'
  import { computed, watch, ref } from 'vue'
  import useMode from './use-mode'
  import useFavorite from './use-favorite'
  import useCd from './use-cd'
  import useMiddleInteractive from './use-middle-interactive'
  import useLyric from './use-lyric'
  import ProgressBar from './progress-bar'
  import { formatTime } from '@/assets/js/util'
  import { PLAY_MODE } from '@/assets/js/constant'
  import Scroll from '@/components/base/scroll/scroll'
  import MiniPlayer from './mini-player'
  export default {
    name: 'player',
    components: {
      ProgressBar,
      Scroll,
      MiniPlayer
    },
    setup() {
      // 在compositionAPI中访问不到this
      // 页面没有显示之前为null，显示之后为audio DOM节点，会默认进行赋值为dom节点，双向数据绑定
      // data
      const audioRef = ref(null) // audio标签
      const songReady = ref(false) // 响应式数据 songReady 初始值为false
      const currentTime = ref(0) // 当前播放时长
      let progressChanging = false // 拖动标志flag

      // vuex
      const store = useStore() // 获得vuex中store：可以获得 state、getters中的数据
      const fullScreen = computed(() => store.state.fullScreen) // 响应式数据，state中fullScreen发生变化fullScreen就可以改变
      const currentSong = computed(() => store.getters.currentSong) // 同样为响应式数据
      const currentIndex = computed(() => store.state.currentIndex) // 当前播放列表的索引
      const playList = computed(() => store.state.playList) // 当前播放列表
      const playing = computed(() => store.state.playing) // 歌曲播放状态
      const playMode = computed(() => store.state.playMode) // 歌曲播放模式

      // computed 计算属性
      const playIcon = computed(() => {
        return playing.value ? 'icon-pause' : 'icon-play'
      })
      const disableCls = computed(() => {
        return songReady.value ? '' : 'disable'
      })
      // 歌曲播放进度 播放时间 / 总时间
      const progress = computed(() => {
        return currentTime.value / currentSong.value.duration
      })

      // hooks 钩子函数
      const { modeIcon, changeMode } = useMode()
      const { getFavoriteIcon, toggleFavorite } = useFavorite()
      const { cdCls, cdRef, cdImageRef } = useCd()
      const {
        currentShow, middleLStyle, middleRStyle,
        onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd
      } = useMiddleInteractive()
      // 获取歌词
      const {
        currentLyric, currentLineNum, playLyric, lyricScrollRef,
        lyricListRef, stopLyric, pureMusicLyric, playingLyric
      } = useLyric({ songReady, currentTime })
      // watch
      // 计算属性computed更像声明式的，watch更像命令式代码，检测变化并写一些逻辑
      // 监听当前歌曲
      watch(currentSong, (newSong) => {
        if (!newSong.id || !newSong.url) {
          return
        }
        currentTime.value = 0 // 歌曲变化时，播放时间置为 0
        songReady.value = false // 切换歌曲的时候置为false
        const audioEl = audioRef.value
        audioEl.src = newSong.url
        // play()方法是异步操作，如果快速切歌，歌曲url发生变化会抛出promise异常
        audioEl.play()
      })
      // 监听播放状态,进行暂停或者播放
      watch(playing, (newPlaying) => {
        if (!songReady.value) { // 点击歌曲 songready为false，则禁止播放
          return
        }
        const audioEl = audioRef.value
        if (newPlaying) {
          audioEl.play()
          playLyric()
        } else {
          audioEl.pause()
          stopLyric()
        }
      })
      // methods
      // 取消全屏
      function goBack() {
        // 提交一个 mutation 更改 fullScreen
        store.commit('setFullScreen', false)
      }
      // 修改播放状态
      function togglePlat() {
        if (!songReady.value) {
          return
        }
        store.commit('setPlayingState', !playing.value) // 只更改了播放状态，并未和audio发生关联
      }
      // audio 暂停事件，音乐主动暂停，非人为触发的事件，或者歌曲播放结束，切换歌曲同样会触发
      function pause() {
        // 修改播放状态为false，
        // 不是用户触发的暂停，通过待机或者锁屏等方式触发的暂停事件，需要同步数据状态
        store.commit('setPlayingState', false)
      }
      // 上一首
      function prev() {
        const list = playList.value // 歌曲个数
        // 开发中注意边界情况保护，代码更高效
        if (!songReady.value || !list.length) { // 没有歌曲 或者 不能播放(歌曲在不能播放前不能上一首或者下一首)
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
        if (!songReady.value || !list.length) { // 没有歌曲 或者 尚不能播放
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
      // 缓冲触发函数 canplay,当歌曲可以播放的时候，再去执行play()
      function ready() {
        if (songReady.value) {
          return
        }
        songReady.value = true
        // 歌曲能播放时，播放歌词，
        playLyric()
      }
      // 音频播放错误,防止一首歌播放错误，也不能切换的情况
      function error() {
        // 允许前进和后退到下一首歌
        songReady.value = true
      }
      // 歌曲播放时长
      function updateTime(e) {
        if (!progressChanging) { // 当拖动的时候不去修改currentTime
          currentTime.value = e.target.currentTime
        }
      }
      // move
      function onProgressChanging(progress) {
        progressChanging = true
        currentTime.value = currentSong.value.duration * progress
        // 手拖动的过程中，先让歌词同步到位置，并不让歌词播放，等到拖动结束在播放歌词
        playLyric()
        stopLyric()
      }
      // move end click同样派发此事件
      function onProgressChanged(progress) {
        progressChanging = false
        audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
        // 如果是暂停状态，则更改为播放状态
        if (!playing.value) {
          store.commit('setPlayingState', true) // playing 由watch监听
        }
        playLyric()
      }
      // 播放结束
      function end() {
        currentTime.value = 0
        if (playMode.value === PLAY_MODE.loop) { // 如果是循环播放
          loop()
        } else {
          next()
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
        next,
        ready,
        disableCls,
        error,
        currentTime,
        progress,
        updateTime,
        formatTime,
        onProgressChanging,
        onProgressChanged,
        end,
        playList,
        // 来自钩子函数 mode
        modeIcon,
        changeMode,
        // 来自狗子函数 favorite
        getFavoriteIcon,
        toggleFavorite,
        // 来自钩子函数 cd
        cdCls,
        cdRef,
        cdImageRef,
        // 来自钩子函数lyric
        currentLyric,
        currentLineNum,
        lyricScrollRef,
        lyricListRef,
        pureMusicLyric,
        playingLyric,
        // 来自钩子函数middle
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd
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
              // 动画 roate 为自定义的旋转 base.scss 0deg-360deg 线性无线循环
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
