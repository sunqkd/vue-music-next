// base 中有命名为 get 的export
import { get } from './base'

export function getRecommend() {
    return get('/api/getRecommend')
}
