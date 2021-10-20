<template>
  <div class="progress-circle">
    <!-- svg 为宽和高 各为100的画布  width height 决定svg渲染大小-->
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
    <!-- 暗颜色圆 中心坐标 50 50，半径50 -->
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
    <!-- 亮色圆 中心坐标 50 50，半径50 -->
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <!-- 渲染 icon -->
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'progress-circle',
    props: {
      radius: { // 尺寸大小 mini播放器渲染为 32*32
        type: Number,
        default: 100
      },
      progress: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        // 圆周长
        dashArray: Math.PI * 100
      }
    },
    computed: {
      // 线性负相关
      dashOffset() {
        return (1 - this.progress) * this.dashArray
      }
    }
  }
</script>

<style lang="scss" scoped>
  .progress-circle {
    position: relative;
    circle {
      stroke-width: 8px;
      transform-origin: center;
      &.progress-background {
        transform: scale(0.9);
        stroke: $color-theme-d;
      }
      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: $color-theme;
      }
    }
  }
</style>
