import EventEmitter from 'eventemitter3'
import { upperFirst } from 'lodash'

export const events = new EventEmitter()
const slides = []
const state = {
  slide: 0,
  previousSlide: -1,
  fragment: -1,
  previousFragment: -1
}

export const initialize = () => {
  slides.push(...[].slice.call(document.querySelectorAll('section.slide')))
  slides[state.slide].classList.add('active')
  updateAppState()

  events.emit('slidechanged', {
    previousSlideIndex: state.previousSlide,
    previousSlide: null,
    slide: slides[state.slide],
    state
  })

  window.addEventListener('keyup', ({ key }) => {
    if (key === 'ArrowRight' || key === ' ') next()
    else if (key === 'ArrowLeft') prev()
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
    state.previousFragment = state.fragment
    state.fragment++
    emitFragmentChange()
  } else if (state.slide < slides.length - 1) {
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
    state.previousFragment = state.fragment
    state.fragment--

    emitFragmentChange()
  } else if (state.slide > 0) {
    state.previousSlide = state.slide
    state.slide--

    state.previousFragment = state.fragment = slides[state.slide]
      .querySelectorAll('.fragment')
      .length - 1

    emitSlideChange()
  }

  updateAppState()
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
  const slideChanged = newState.slide !== state.slide
  const fragmentChanged = newState.fragment !== state.fragment

  Object.assign(state, newState)

  slideChanged && emitSlideChange()
  !slideChanged && fragmentChanged && emitFragmentChange()

  updateAppState()
}

const updateAppState = () => {
  const app = document.querySelector('#app')
  const slide = slides[state.slide]
  const fragments = Array.from(slide.querySelectorAll('.fragment'))
  const fragment = state.fragment > 0 && fragments[state.fragment + 1]

  slide.classList.add('active')
  if (state.previousSlide !== -1){
    slides[state.previousSlide].classList.remove('active')
  }

  for (let i = 0; i < fragments.length; i++) {
    if (i === state.fragment) {
      fragments[i].classList.add('active', 'current')
    } else if (i < state.fragment) {
      fragments[i].classList.add('active')
      fragments[i].classList.remove('current')
    } else {
      fragments[i].classList.remove('active', 'current')
    }
  }

  for (let prop in app.dataset) { delete app.dataset[prop] }
  for (let prop in slide.dataset) { app.dataset[`slideState${upperFirst(prop)}`] = slide.dataset[prop] }
  if (fragment) {
    for (let prop in fragment.dataset) {
      app.dataset[`fragmentState${upperFirst(prop)}`] = fragment.dataset[prop]
    }
  }
}
