<template>
    <div class="search-list">
        <transition-group name="list" tag="ul">
            <li
                v-for="item in searches"
                :key="item"
                class="search-item"
                @click="selectItem(item)"
            >
                <span class="text">{{item}}</span>
                <span
                    v-if="showDelete"
                    class="icon"
                    @click.stop="delectItem(item)"
                >
                    <i class="icon-delete"></i>
                </span>
            </li>
        </transition-group>
    </div>
</template>

<script>
    export default {
        name: 'search-list',
        props: {
            searches: {
                type: Array,
                default() {
                    return []
                }
            },
            showDelete: {
                type: Boolean,
                default: true
            }
        },
        emits: ['select', 'delete'],
        methods: {
            // 选择记录
            selectItem(item) {
                this.$emit('select', item)
            },
            // 删除记录
            delectItem(item) {
                this.$emit('delete', item)
            }
        }
    }
</script>

<style lang="scss" scoped>
  .search-list {
    .search-item {
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      .text {
        flex: 1;
        color: $color-text-l;
      }
      .icon {
        @include extend-click();
        .icon-delete {
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
</style>
