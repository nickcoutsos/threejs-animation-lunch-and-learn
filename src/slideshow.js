import EventEmitter from 'eventemitter3'
import { upperFirst } from 'lodash'

export const events = new EventEmitter()
const slides = []

export const state = {
  slide: 0,
  previousSlide: -1,
  fragment: -1,
  previousFragment: -1,
  usePresenterState: true
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
