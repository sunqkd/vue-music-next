<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div
      class="back"
      @click="goBack()"
    >
      <i class="icon-back"></i>
    </div>
    <!-- 标题 -->
    <h1 class="title">{{ title }}</h1>
    <!-- 图片层 -->
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage"
    >
    <!-- 半透明模糊 -->
      <div
        class="filter"
        :style="filterStyle"
      ></div>
    </div>
    <!-- 可滚动列表 -->
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-noResult:[noResultText]="noResult"
      :probeType="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          @select="selectItem"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
  import SongList from '@/components/base/song-list/song-list'
  import Scroll from '@/components/base/scroll/scroll'
  import { mapActions } from 'vuex'
  const RESERVED_HEIGHT = 40

  export default {
    name: 'music-list',
    components: {
      SongList,
      Scroll
    },
    props: {
      // 歌曲列表
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      // 标题
      title: String,
      // 背景图片url
      pic: String,
      loading: Boolean, // 组件loading 此组件没有数据获取的接口请求，则从父组件中传入loading
      noResultText: {
        type: String,
        default: '抱歉，没有找到可播放的歌曲'
      }
    },
    data() {
      return {
        imageHeight: 0, // 图片初始高度
        scrollY: 0, // 滚动的 距离
        maxTranslateY: 0 // 最大滚动距离，初始值设置为 0
      }
    },
    computed: {
      // 背景图片url地址
      bgImageStyle() {
        // 根据滚动高度的变化调整z-index
        const scrollY = this.scrollY
        let zIndex = 0 // 默认z-index为0
        let paddingTop = '70%' // 默认宽高比为70%
        let height = 0 // 高度为0
        let translateZ = 0 // 为了兼容苹果
        if (scrollY > this.maxTranslateY) {
          zIndex = 10
          paddingTop = 0
          height = `${RESERVED_HEIGHT}px`
          translateZ = 1
        }
        // 下拉使图片放大
        let scale = 1
        if (scrollY < 0) {
          scale = 1 + Math.abs(scrollY / this.imageHeight)
        }

        return {
          zIndex,
          paddingTop,
          height,
          backgroundImage: `url(${this.pic})`,
          transform: `translateZ(${translateZ}px)scale(${scale})`
        }
      },
      // 动态给滚动列表设置高度
      scrollStyle() {
        return {
          top: `${this.imageHeight}px`
        }
      },
      // 列表向上滚动，图片遮罩板，模糊
      filterStyle() {
        let blur = 0
        const scrollY = this.scrollY // 滚动距离
        const imageHeight = this.imageHeight
        // // 向上滚动过程需要模糊，向下拉不需要模糊效果
        if (scrollY >= 0) {
          // 最大值定为：最大滚动高度 系数为20
          blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
        }
        return {
          backdropFilter: `blur(${blur}px)`
        }
      },
      // 歌曲列表没有数据 使用v-noResult指令 loading为false 并且歌曲为空
      noResult() {
        return !this.loading && !this.songs.length
      }
    },
    mounted() {
      // 获得图层高度
      this.imageHeight = this.$refs.bgImage.clientHeight
      // 最大向上滚动距离
      this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
    },
    methods: {
      ...mapActions(['selectPlay']),
      // 返回按钮
      goBack() {
        // 回退到原来的页面，原来的页面不刷新，路由向后退
        this.$router.back()
      },
      // 监听滚动事件
      onScroll(pos) {
        // 得到滚动距离
        this.scrollY = -pos // 滚动y值为负值
      },
      // 接受子组件派发的事件
      selectItem({ song, index }) {
        // 派发 actions 提交mutations
        // 可以使用vuex提供的语法糖
        this.selectPlay({
          list: this.songs,
          index
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      // padding-top:70%;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      // overflow: hidden;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
