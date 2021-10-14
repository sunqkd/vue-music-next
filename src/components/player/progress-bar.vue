<template>
  <div class="progress-bar">
    <!-- 黑色条 -->
    <div class="bar-inner">
        <!-- 黄色条 -->
        <div
            class="progress"
            :style="progressStyle"
        ></div>
        <!-- button -->
        <div
            class="progress-btn-wrapper"
            :style="btnStyle"
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
    props: {
        progress: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            offset: 0 // 偏移量，通过progress计算
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
