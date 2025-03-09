import { throttle } from 'lodash-es'

const input = (data, evt) => {
  let input = evt.target.value

  if (data.key === 'Backspace' && data.isDashEnd) {
    input = input.substr(0, input.length - 1)
  }
  const values = input.split('-').map((item) => {
    return item.replace(/\D/g, '')
  })
  if (values[1]) values[1] = checkValue(values[1], 12)
  if (values[2]) values[2] = checkValue(values[2], 31)
  const output = values.map((item, index) => {
    switch (index) {
      case 0:
        return item.length === 4 ? item + '-' : item
      case 1:
        return item.length === 2 ? item + '-' : item
      case 2:
        return item
    }
  })
  evt.target.value = output.join('').substr(0, 10)
}

const checkValue = (str, max) => {
  if (str.charAt(0) !== '0' || str == '00') {
    let num = parseInt(str)
    if (isNaN(num) || num <= 0 || num > max) num = max
    str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString()
  }

  return str
}

const keydown = (data, evt) => {
  data.key = evt.key
  if (/\d-$/.test(evt.target.value)) data.isDashEnd = true
  else data.isDashEnd = false
}

export const dateInput = {
  mounted(el) {
    const data = {
      key: null,
      isDashEnd: false,
    }

    const keydownBind = keydown.bind(null, data)
    const inputBind = input.bind(null, data)

    el.onkeydown = keydownBind
    el.oninput = inputBind
  },
  unmounted(el) {
    el.onkeydown = null
    el.oninput = null
  },
}

const resizeFn = (callback, entries) => {
  const width = entries[0].borderBoxSize[0].inlineSize
  const height = entries[0].borderBoxSize[0].blockSize
  callback({ width, height })
}

const resizeObservers = []

export const resize = {
  mounted(el, binding) {
    const resizeBind = throttle(resizeFn.bind(null, binding.value), 300)
    const resizeObserver = new ResizeObserver(resizeBind)
    resizeObserver.observe(el)
    resizeObservers.push({ el, resizeObserver })
  },
  unmounted(el) {
    const index = resizeObservers.findIndex((item) => item.el === el)
    resizeObservers[index].resizeObserver.unobserve(el)
    resizeObservers.splice(index, 1)
  },
}
