<template>
  <div
    class="progress-bar"
    @click="onClick">
    <!-- 黑色条 -->
    <div class="bar-inner">
        <!-- 黄色条 -->
        <div
            class="progress"
            ref="progress"
            :style="progressStyle"
        ></div>
        <!-- button -->
        <div
            class="progress-btn-wrapper"
            :style="btnStyle"
            @touchstart.prevent = "onTouchStart"
            @touchmove.prevent = "onTouchMove"
            @touchend.prevent = "onTouchEnd"
        >
            <div class="progress-btn"></div>
        </div>
    </div>
  </div>
</template>

<script>
  const progressBtnWidth = 16 // 进度条按钮宽度
  export default {
    name: 'progress-bar',
    // 派发事件，move时 和 move end时
    emits: ['progress-changing', 'progress-changed'],
    props: {
        progress: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            offset: 0 // 偏移量，通过progress计算 变化后页面重新渲染
        }
    },
    computed: {
        // 黄色进度条宽度
        progressStyle() {
            return `width:${this.offset}px`
        },
        // 按钮位置
        btnStyle() {
            return `transform:translate3D(${this.offset}px,0,0)`
        }
    },
    watch: {
        // 利弊：使用computed 一来就会计算一次  this.$el.clientWidth 得不到值，直到mounted之后才能获取
        // watch：progress变化 组件已经渲染完成 this.$el.clientWidth 可以拿到
        progress(newProgress) {
            const barWidth = this.$el.clientWidth - progressBtnWidth // 黄色进度条的宽度
            this.offset = barWidth * newProgress
        }
    },
    created() {
        // 此处不需要定义到data中，data中的数据都是响应式的数据，数据变化同样更新视图
        // touch 只是让不同函数共享状态，没必要设置成响应式，浪费性能
        this.touch = {}
    },
    methods: {
        // 拖动按钮
        onTouchStart(e) {
            this.touch.x1 = e.touches[0].pageX // 点击X轴坐标
            this.touch.beginWidth = this.$refs.progress.clientWidth // 点击进度条初始宽度
        },
        onTouchMove(e) {
            const delta = e.touches[0].pageX - this.touch.x1 // 横坐标偏移量
            const tempWidth = this.touch.beginWidth + delta // 位移过后进度条的宽度
            const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条总宽度
            const progress = Math.min(1, Math.max(tempWidth / barWidth, 0)) // 播放进度 限定在[0,1]之间
            this.offset = barWidth * progress // 通过滚动影响 播放比例 设定播放宽度
            this.$emit('progress-changing', progress) // 派发进度
        },
        onTouchEnd() {
            const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条总宽度
            const progress = this.$refs.progress.clientWidth / barWidth // 进度
            this.$emit('progress-changed', progress) // 派发进度
        },
        // 点击事件 同样派发播放比例
        onClick(e) {
            const rect = this.$el.getBoundingClientRect() // 获取到边界的距离 可以得到rect中left的值
            const offsetWidth = e.pageX - rect.left // 进度条宽度
            const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条总宽度
            const progress = offsetWidth / barWidth // 播放比例
            this.$emit('progress-changed', progress) // 派发进度
        }

    }
  }
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
