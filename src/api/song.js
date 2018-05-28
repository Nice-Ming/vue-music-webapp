import jsonp from 'common/js/jsonp.js'
import { commonParams } from './config.js'
import axios from 'axios'

export function getSongvkey(mid) {
  const url = '/api/getSongvkey' // 开发环境
  // const url = 'http://www.niceming.cn:3000/api/getSongvkey' // 上线

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    filename: `C400${mid}.m4a`,
    guid: 2243956414,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    cid: 205361747,
    format: 'json'
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}

export function getSongLyric(mid) {
  const url = '/api/getSongLyric' // 开发环境
  // const url = 'http://www.niceming.cn:3000/api/getSongLyric' // 上线

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
