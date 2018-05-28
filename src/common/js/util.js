function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 数组洗牌（打乱顺序）
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let _item = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = _item
  }
  return _arr
}

// 防抖处理
export function debounce(func, delay) {
  let timer

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
