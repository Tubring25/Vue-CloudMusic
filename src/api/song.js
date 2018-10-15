import axios from 'axios'
import {HOST} from '../common/js/config'

// 此函数与singer中getMusic一样，可省略
export function getSong (id) {
  const url = HOST + `/music/url?id=${id}`
  return axios.get(url)
}

export function getLyric (id) {
  const url = HOST + `/lyric?id=${id}`
  return axios.get(url)
}
