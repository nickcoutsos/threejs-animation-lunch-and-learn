import get from 'lodash/get'
import isNumber from 'lodash/isNumber'

export default function (frame, options = {}) {
  let direction = 1
  let start_
  let active_ = null
  let activeOptions = {}

  if (options && isNumber(options)) {
    options = { duration: options }
  }

  function start (playbackOptions) {
    if (start_ && direction === 1) {
      return
    }

    direction = 1
    start_ = Date.now()
    activeOptions = Object.assign(
      {},
      options,
      { callback: () => {} },
      playbackOptions
    )

    if (active_) {
      cancelAnimationFrame(active_)
    }

    active_ = requestAnimationFrame(animate)
  }

  function reverse (playbackOptions) {
    if (start_ && direction === -1) {
      return
    }

    direction = -1
    start_ = Date.now()
    activeOptions = Object.assign(
      {},
      options,
      { callback: () => {} },
      options.reverseOptions,
      playbackOptions
    )

    if (active_) {
      cancelAnimationFrame(active_)
    }

    active_ = requestAnimationFrame(animate)
  }

  function stop () {
    start_ = undefined
    cancelAnimationFrame(active_)
    active_ = null
  }

  function animate () {
    const now = Date.now()
    const delta = now - start_
    const duration = get(activeOptions, 'duration', 100)
    const repeat = get(activeOptions, 'repeat', false)
    const timingFunction = get(
      activeOptions,
      'timingFunction',
      arguments[2] || (t => t)
    )

    const f = duration > 0 ? delta / duration : 1
    const t = Math.max(0, Math.min(1, direction > 0 ? f : (1 - f)))

    frame(timingFunction(t))

    if ((t < 1 && direction > 0) || (t > 0 && direction < 0)) {
      active_ = requestAnimationFrame(animate)
    } else if (repeat) {
      start_ = Date.now()
      active_ = requestAnimationFrame(animate)
    } else {
      stop()
      activeOptions.callback()
      return
    }

  }

  return {
    start,
    stop,
    reverse
  }
}
