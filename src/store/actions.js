import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'
// 选择播放
export function selectPlay({ commit }, { list, index }) {
    commit('setPlayMode', PLAY_MODE.sequence) // 顺序播放模式
    commit('setSequenceList', list) // 歌曲列表原始数据
    commit('setPlayingState', true) // 播放状态
    commit('setFullScreen', true) // 全屏播放
    commit('setPlayList', list) // 播放列表 默认和歌曲列表相同
    commit('setCurrentIndex', index) // 播放索引
}

// 随机播放
// 不需要索引，随机列表的第一首歌，就可以是播放的歌曲
export function randomPlay({ commit }, list) {
    // 对list进行洗牌
    commit('setPlayMode', PLAY_MODE.random) // 随机播放模式
    commit('setSequenceList', list) // 歌曲列表原始数据
    commit('setPlayingState', true) // 播放状态
    commit('setFullScreen', true) // 全屏播放
    commit('setPlayList', shuffle(list)) // 播放列表 默认和歌曲列表相同
    commit('setCurrentIndex', 0) // 播放索引 不需要传参数 0即可
}

// 切换播放模式
export function changeMode({ commit, state, getters }, mode) {
    // 当前播放的playID
    const currentId = getters.currentSong.id
    if (mode === PLAY_MODE.random) { // 随机播放
        commit('setPlayList', shuffle(state.sequenceList)) // 播放列表洗牌算法，乱序
    } else { // 顺序播放或者循环播放 播放列表和原始列表相同
        commit('setPlayList', state.sequenceList)
    }
    // 修改 currentIndex state.playList为最新的播放列表,找到当前歌曲在列表中的索引值
    const index = state.playList.findIndex((song) => {
        return song.id === currentId
    })
    commit('setCurrentIndex', index) // 当前歌曲索引
    commit('setPlayMode', mode) // 播放模式
}

// 删除歌曲操作
export function removeSong({ commit, state }, song) {
    // 从sequenceList 和 playList 找到并删除
    const sequenceList = state.sequenceList
    const playList = state.playList
    const sequenceIndex = findIndex(sequenceList, song)
    const playIndex = findIndex(playList, song)
    console.log(sequenceIndex, playIndex)
}
// 功能相同，封装函数
function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}
