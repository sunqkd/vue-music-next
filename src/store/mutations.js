// 对state数据进行修改的唯一途径
const mutations = {
    // 修改播放状态
    setPlayingState(state, playing) {
        state.playing = playing
    },
    // 设置顺序播放列表(原始数据)
    setSequenceList(state, list) {
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
    },
    // 设置收藏歌曲
    setFavoriteList(state, list) {
        state.favoriteList = list
    },
    // 给歌曲添加歌词
    addSongLyric(state, { song, lyric }) {
        // 引用数据类型同一个数组 playList是根据sequenceList变更的，sequenceList发生变化，同样playList会增加歌词属性
        state.sequenceList.map((item) => {
            if (item.mid === song.mid) {
                item.lyric = lyric
            }
            return item
        })
    }
}
export default mutations
