import { PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'
const state = {
    sequenceList: [], // 歌曲列表原始数据
    playList: [], // 正在播放的播放列表
    playing: false, // 是否正在播放(播放状态)
    playMode: PLAY_MODE.sequence, // 默认为顺序播放
    currentIndex: 0, // 当前播放的歌曲索引
    fullScreen: false, // 播放器的状态 全屏、非全屏
    favoriteList: [], // 收藏歌曲列表, 初始化从本地存储中加载，防止刷新vuex数据消失,main.js中重新请求
    searchHistory: load(SEARCH_KEY), // 搜索历史
    playHistory: [] // 播放历史
}
export default state
