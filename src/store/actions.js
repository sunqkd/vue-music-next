import { PLAY_MODE } from '@/assets/js/constant'
// 选择播放
export function selectPlay({ commit, state }, { list, index }) {
    commit('setPlayMode', PLAY_MODE.sqeuence) // 顺序播放模式
    commit('setSquenceList', list) // 歌曲列表原始数据
    commit('setPlayingState', true) // 播放状态
    commit('setFullScreen', true) // 全屏播放
    commit('setPlayList', list) // 播放列表 默认和歌曲列表相同
    commit('setCurrentIndex', index) // 播放索引
}
