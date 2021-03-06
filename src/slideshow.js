import EventEmitter from 'eventemitter3'
import { upperFirst } from 'lodash'

export const events = new EventEmitter()
const slides = []

export const state = {
  absolute: 0,
  slide: 0,
  previousSlide: -1,
  fragment: -1,
  previousFragment: -1,
  usePresenterState: true,
  durationOverride: null
}

export const initialize = () => {
  slides.push(...[].slice.call(document.querySelectorAll('section.slide')))

  let counter = 0
  slides.forEach(slide => {
    slide.dataset.absoluteIndex = counter++
    const fragments = Array.from(slide.querySelectorAll('.fragment'))
    fragments.forEach(fragment => {
      fragment.dataset.absoluteIndex = counter++
    })
  })

  slides[state.slide].classList.add('active')
  updateAppState()

  events.emit('slidechanged', {
    previousSlideIndex: state.previousSlide,
    previousSlide: null,
    slide: slides[state.slide],
    state
  })

  events.on('swipe', ({ direction }) => {
    if (direction === 'right') {
      prev()
    } else if (direction === 'left') {
      next()
    }
  })
}

export const next = () => {
  const fragments = slides[state.slide].querySelectorAll('.fragment')
  if (state.fragment < fragments.length - 1) {
    state.absolute++
    state.previousFragment = state.fragment
    state.fragment++
    emitFragmentChange()
  } else if (state.slide < slides.length - 1) {
    state.absolute++
    state.previousSlide = state.slide
    state.slide++
    state.fragment = -1
    state.previousFragment = -1
    emitSlideChange()
  }

  updateAppState()
}

export const prev = () => {
  if (state.fragment > -1) {
    state.absolute--
    state.previousFragment = state.fragment
    state.fragment--

    emitFragmentChange()
  } else if (state.slide > 0) {
    state.absolute--
    state.previousSlide = state.slide
    state.slide--

    state.previousFragment = state.fragment = slides[state.slide]
      .querySelectorAll('.fragment')
      .length - 1

    emitSlideChange()
  }

  updateAppState()
}

export const seekTo = (targetState) => {
  const advance = targetState.absolute > state.absolute ? next : prev
  if (state.seekingInterval) {
    clearInterval(state.seekingInterval)
  }

  setState({ durationOverride: 100, seekingInterval: setInterval(() => {
    console.log('tick', targetState.absolute, state.absolute)
    if (Math.abs(targetState.absolute - state.absolute) <= 1) {
      console.log('catching up, clear override')
      setState({ durationOverride: null })
    }
    if (state.absolute === targetState.absolute) {
      console.log('last one, clear interval')
      clearInterval(state.seekingInterval)
      setState({
        seekingInterval: null,
        usePresenterState: true
      })
      return
    }

    console.log('advance')
    advance()
  }, 120)
 })
}

const emitSlideChange = () => {
  events.emit('slidechanged', {
    previousSlideIndex: state.previousSlide,
    previousSlide: slides[state.previousSlide],
    slide: slides[state.slide],
    state
  })
}

const emitFragmentChange = () => {
  const fragments = Array.from(
    slides[state.slide].querySelectorAll('.fragment')
  )

  events.emit('fragmentchanged', {
    slide: slides[state.slide],
    previousFragmentIndex: state.previousFragment,
    previousFragment: fragments[state.previousFragment],
    fragment: fragments[state.fragment],
    state
  })
}

export const setState = newState => {
  const slideChanged = ('slide' in newState) && newState.slide !== state.slide
  const fragmentChanged = ('fragment' in newState) && newState.fragment !== state.fragment

  Object.assign(state, newState)

  slideChanged && emitSlideChange()
  !slideChanged && fragmentChanged && emitFragmentChange()

  updateAppState()
}

const updateAppState = () => {
  const app = document.body
  const slide = slides[state.slide]
  const fragments = Array.from(slide.querySelectorAll('.fragment'))
  const fragment = state.fragment > 0 && fragments[state.fragment + 1]

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.toggle('active', i === state.slide)
  }

  for (let i = 0; i < fragments.length; i++) {
    fragments[i].classList.toggle('active', i <= state.fragment)
    fragments[i].classList.toggle('current', i === state.fragment)
  }

  for (let prop in app.dataset) { delete app.dataset[prop] }
  for (let prop in slide.dataset) { app.dataset[`slideState${upperFirst(prop)}`] = slide.dataset[prop] }
  if (fragment) {
    for (let prop in fragment.dataset) {
      app.dataset[`fragmentState${upperFirst(prop)}`] = fragment.dataset[prop]
    }
  }

  app.dataset.isPresenter = !!state.isPresenter
  app.dataset.usePresenterState = !!state.usePresenterState
  app.dataset.hasPresenterState = 'presenterState' in state
}
