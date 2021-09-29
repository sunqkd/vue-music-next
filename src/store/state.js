import { PLAY_MODE } from '@/assets/js/constant'
const state = {
    sequenceList: [], // 歌曲列表原始数据
    playList: [], // 正在播放的播放列表
    playing: false, // 是否正在播放(播放状态)
    playMode: PLAY_MODE.sqeuence, // 默认为顺序播放
    currentIndex: 0, // 当前播放的歌曲索引
    fullScreen: false // 播放器的状态 全屏、非全屏
}
export default state
