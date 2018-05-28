export function addClass(el, className) {
	if (hasClass(el, className)) {
		return
	}
	el.classList.add(className)
}

export function hasClass(el, className) {
	return el.classList.contains(className);
}

export function getDataAttribute(el, name, val) {
	const prefix = 'data-'

	if (val) {
		return el.setAttribute(prefix + name, val)
	}
	return el.getAttribute(prefix + name)
}

export function getStyle(el, attr) {
	if(window.getComputedStyle){
		return window.getComputedStyle(el, null)[attr];
	}
	return el.currentStyle[attr];
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
