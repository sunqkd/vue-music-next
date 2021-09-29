// 对state数据进行修改的唯一途径
const mutations = {
    // 修改播放状态
    setPlayingState(state, playing) {
        state.playing = playing
    },
    // 设置顺序播放列表(原始数据)
    setSquenceList(state, list) {
        state.sequenceList = list
    },
    // 设置播放列表
    setPlayList(state, list) {
        state.playList = list
    },
    // 设置播放顺序
    setPlayMode(state, mode) {
        state.playMode = mode
    },
    // 设置当前播放索引
    setCurrentIndex(state, index) {
        state.currentIndex = index
    },
    // 设置是否全屏
    setFullScreen(state, fullScreen) {
        state.fullScreen = fullScreen
    }
}
export default mutations
