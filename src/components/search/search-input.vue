<template>
    <div class="search-input">
        <i class="icon-search"></i>
        <input
            class="input-inner"
            v-model="query"
            :placeholder="placeholder"
        />
        <i
            v-show="query"
            class="icon-dismiss"
            @click="clear"
        >
        </i>
    </div>
</template>
<script>
import { debounce } from 'throttle-debounce'

export default {
    name: 'search-input',
    props: {
        modelValue: String, // 用于组件的双向数据绑定 区别与vue2.0的value
        placeholder: {
            type: String,
            default: '搜索歌曲、歌手'
        }
    },
    data() {
        return {
            // modelValue变化，query再也不会知道
            query: this.modelValue
        }
    },
    created() {
        this.$watch('query', debounce(300, (newQuery) => {
            // 为了解决this指向
            this.$emit('update:modelValue', newQuery.trim())
        }))
        // 外部直接填充
        this.$watch('modelValue', (newVal) => {
            this.query = newVal
        })
    },
    methods: {
        // 清空按钮
        clear() {
            this.query = ''
        }
    }
    // watch: {
        // 区别于 vue 2.0 派发input事件
        // query(newQuery) {
        //     this.$emit('update:modelValue', newQuery.trim())
        // }
        // query: debounce(300, (newQuery) => {
        //     console.log(this)
        //     console.log(newQuery)
        //     // this.$emit('update:modelValue', newQuery.trim())
        // })
    // }
}
</script>
<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
