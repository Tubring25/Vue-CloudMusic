export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData (el, name, val) {
  const prefix = 'data-'
  name += prefix
  if (val) {
    // 如果有 val 就添加这个 val 到dom
    // name = 'val'
    return el.setAttribute(name, val)
  } else {
    // 如果没有 val ，就获取dom 中的 name
    return el.getAttribute(name)
  }
}
