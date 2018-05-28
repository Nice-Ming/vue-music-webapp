import jsonp from 'common/js/jsonp.js'
import { commonParams, options } from './config.js'
import axios from 'axios'

// 推荐页面的轮播图
export function getRecommend() {
  const url =
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 推荐页面的歌单列表
export function getDiscList() {
  const url = '/api/getDiscList' // 开发环境
  // const url = 'http://www.niceming.cn:3000/api/getDiscList' // 上线

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
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

// 推荐页面的单个歌单的歌曲列表
export function getSongList(disstid) {
  const url = '/api/getSongList' // 开发环境
  // const url = 'http://www.niceming.cn:3000/api/getSongList' // 上线

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
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
