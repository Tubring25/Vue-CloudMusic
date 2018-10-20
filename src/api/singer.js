import axios from 'axios'
import {HOST} from '../common/js/config'

//  获取热门歌手
export function getSingers () {
  const url = HOST + `/top/artists?limit=100`
  return axios.get(url)
}

// 获取具体歌手
export function getSingerDetail (singerId) {
  const url = HOST + `/artists?id=${singerId}`
  return axios.get(url)
}

// 获取音乐
export function getMusic (musicId) {
  const url = HOST + `/music/url?id=${musicId}`
  return axios.get(url)
}
