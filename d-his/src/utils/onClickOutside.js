import { isString } from 'lodash-es'
import { watch, unref, onScopeDispose, getCurrentScope } from 'vue'

let _a

const isClient = typeof window !== 'undefined'

const defaultWindow = isClient ? window : void 0

const isIOS =
  isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent)

const noop = () => {}

function resolveUnref(r) {
  return typeof r === 'function' ? r() : unref(r)
}

function unrefElement(elRef) {
  let _a
  const plain = resolveUnref(elRef)
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain
}

function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}

function useEventListener(...args) {
  let target
  let events
  let listeners
  let options
  if (isString(args[0]) || Array.isArray(args[0])) {
    ;[events, listeners, options] = args
    target = defaultWindow
  } else {
    ;[target, events, listeners, options] = args
  }
  if (!target) return noop
  if (!Array.isArray(events)) events = [events]
  if (!Array.isArray(listeners)) listeners = [listeners]
  const cleanups = []
  const cleanup = () => {
    cleanups.forEach((fn) => fn())
    cleanups.length = 0
  }
  const register = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2)
    return () => el.removeEventListener(event, listener, options2)
  }
  const stopWatch = watch(
    () => [unrefElement(target), resolveUnref(options)],
    ([el, options2]) => {
      cleanup()
      if (!el) return
      cleanups.push(
        ...events.flatMap((event) => {
          return listeners.map((listener) => register(el, event, listener, options2))
        })
      )
    },
    { immediate: true, flush: 'post' }
  )
  const stop = () => {
    stopWatch()
    cleanup()
  }
  tryOnScopeDispose(stop)
  return stop
}

let _iOSWorkaround = false
export function onClickOutside(target, handler, options = {}) {
  const { window = defaultWindow, ignore = [], capture = true, detectIframe = false } = options
  if (!window) return
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true
    Array.from(window.document.body.children).forEach((el) => el.addEventListener('click', noop))
  }
  let shouldListen = true
  const shouldIgnore = (event) => {
    return ignore.some((target2) => {
      if (typeof target2 === 'string') {
        return Array.from(window.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el))
      } else {
        const el = unrefElement(target2)
        return el && (event.target === el || event.composedPath().includes(el))
      }
    })
  }
  const listener = (event) => {
    const el = unrefElement(target)
    if (!el || el === event.target || event.composedPath().includes(el)) return
    if (event.detail === 0) shouldListen = !shouldIgnore(event)
    if (!shouldListen) {
      shouldListen = true
      return
    }
    handler(event)
  }
  const cleanup = [
    useEventListener(window, 'click', listener, { passive: true, capture }),
    useEventListener(
      window,
      'pointerdown',
      (e) => {
        const el = unrefElement(target)
        if (el) shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e)
      },
      { passive: true }
    ),
    detectIframe &&
      useEventListener(window, 'blur', (event) => {
        let _a
        const el = unrefElement(target)
        if (
          ((_a = window.document.activeElement) == null ? void 0 : _a.tagName) === 'IFRAME' &&
          !(el == null ? void 0 : el.contains(window.document.activeElement))
        )
          handler(event)
      }),
  ].filter(Boolean)
  const stop = () => cleanup.forEach((fn) => fn())
  return stop
}
