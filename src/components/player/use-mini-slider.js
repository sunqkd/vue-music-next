// mini 播放器 滑动切换
import { ref, computed, onMounted, onUnmounted, watch, nextTick, onActivated, onDeactivated } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core' // 核心组件
import Slide from '@better-scroll/slide' // slide插件 轮播图
// 不同文件，多次注册不存在问题，不能保证那个文件先执行注册，
// 多次注册不会报错
BScroll.use(Slide)

export default function useMiniSlider() {
    const sliderWrapperRef = ref(null)
    const slider = ref(null)

    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const playList = computed(() => store.state.playList)
    const currentIndex = computed(() => store.state.currentIndex)

    // sliderShow 存在条件 全屏关闭 列表有值 !! 双非转换成布尔类型
    const sliderShow = computed(() => {
        return !fullScreen.value && !!playList.value.length
    })

    // v-show 操作的页面, 只执行一次onMounted onUnmounted
    // 初始化 slider 在页面加载完成之后，所以在onMounted中实例化
    onMounted(() => {
        // 监听slidershow
        let sliderVal = slider.value
        watch(sliderShow, async (newSliderShow) => {
            if (newSliderShow) {
                await nextTick()
                // 未初始化
                if (!sliderVal) {
                    sliderVal = new BScroll(sliderWrapperRef.value, {
                        click: true, // 允许点击
                        scrollX: true, // 横向滚动
                        scrollY: false, // 纵向滚动禁止
                        momentum: false,
                        bounce: false,
                        probeType: 2,
                        slide: { // slide 插件
                            loop: true,
                            autoplay: false
                        }
                    })
                    // 左右滑动会触发页面change 另，删除歌曲在播放歌曲的前面或删除正在播放的歌曲，同样会触发页面change事件
                    sliderVal.on('slidePageChanged', ({ pageX }) => {
                        store.commit('setCurrentIndex', pageX)
                    })
                } else {
                    // 刷新
                    sliderVal.refresh()
                }
                // goToPage(pageX, pageY, [time], [easing]) 索引下标
                sliderVal.goToPage(currentIndex.value, 0, 0)
            }
        })
        // 滚动到正在播放页
        watch(currentIndex, (newIndex) => {
            if (sliderVal && sliderShow.value) {
                sliderVal.goToPage(newIndex, 0, 0)
            }
        })
        // 删除歌曲的时候对mini-slider刷新，删除掉最后一首歌，或者清空歌曲。不能refresh操作，最少保留一个dom节点
        watch(playList, async(newList) => {
            // slider 对象 、 显示、歌曲长度
            if (sliderVal && sliderShow.value && newList.length) {
                // 数据变化到dom变化需要nextTick之后
                await nextTick()
                sliderVal.refresh()
            }
        })
    })
    // 卸载逻辑处理
    onUnmounted(() => {
        if (slider.value) {
            slider.value.destroy()
        }
    })
    // keep-alive
    onActivated(() => {
        slider.value.enable()
        slider.value.refresh()
    })
    onDeactivated(() => {
        slider.value.disable()
    })
    return {
        sliderWrapperRef,
        slider
    }
}
