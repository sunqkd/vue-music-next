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
    // 从 sequenceList 和 playList 找到并删除。更改state只能通过提交 mutations,数组属于引用数据类型
    // 此处生成一个新数组
    const sequenceList = state.sequenceList.slice()
    const playList = state.playList.slice()

    const sequenceIndex = findIndex(sequenceList, song)
    const playIndex = findIndex(playList, song)
    // 做边界保护,未找到返回
    if (sequenceIndex < 0 || playIndex < 0) {
        return
    }
    // splice 会改变原数组
    sequenceList.splice(sequenceIndex, 1)
    playList.splice(playIndex, 1)
    let currentIndex = state.currentIndex
    // 删除的歌曲在当前歌曲的前面 或者 删除后当前顺序和长度相同（删除最后一首歌）
    if (playIndex < currentIndex || currentIndex === playList.length) {
        currentIndex--
    }
    // 提交mutations
    commit('setSequenceList', sequenceList)
    commit('setPlayList', playList)
    commit('setCurrentIndex', currentIndex)
    // 删除完，最后一首歌，更改播放状态
    if (!playList.length) {
        commit('setPlayingState', false)
    }
}
// 添加歌曲
export function addSong({ commit, state }, song) {
    // 生成新数组 播放列表 歌曲列表
    // 判断播放列表中是否包含，此歌曲。如果包含则不需要添加，只需要修改currentIndex即可
    const playList = state.playList.slice()
    const sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    const playIndex = findIndex(playList, song)
    // 已经存在
    if (playIndex > -1) {
        currentIndex = playIndex
    } else {
        playList.push(song)
        currentIndex = playList.length - 1
    }
    const sequenceIndex = findIndex(sequenceList, song)
    if (sequenceIndex === -1) {
        sequenceList.push(song)
    }
    commit('setSequenceList', sequenceList)
    commit('setPlayList', playList)
    commit('setCurrentIndex', currentIndex)
    commit('setPlayingState', true)
    commit('setFullScreen', true)
}
// 功能相同，封装函数
function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

// 清空歌曲列表
export function clearSongList({ commit, state }) {
    commit('setSequenceList', [])
    commit('setPlayList', [])
    commit('setCurrentIndex', 0)
    commit('setPlayingState', false)
}
