import EventEmitter from 'eventemitter3'
import { upperFirst } from 'lodash'

export const events = new EventEmitter()

export const initialize = () => {
  const slides = [].slice.call(document.querySelectorAll('section.slide'))
  const state = {
    slide: 0,
    fragment: -1
  }

  slides[state.slide].classList.add('active')
  updateAppState(slides, state)

  events.emit('slidechanged', {
    previousSlideIndex: state.previousSlide,
    previousSlide: null,
    slide: slides[state.slide],
    state
  })

  window.addEventListener('keyup', ({ key }) => {
    if (key === 'ArrowRight' || key === ' ') next(slides, state)
    else if (key === 'ArrowLeft') prev(slides, state)
  })
}

export const next = (slides, state) => {
  const fragments = [].slice.call(slides[state.slide].querySelectorAll('.fragment'))

  if (state.fragment < fragments.length - 1) {
    state.previousFragment = state.fragment
    state.fragment++
    const previousFragment = fragments[state.previousFragment]
    const fragment = fragments[state.fragment]
    const formerCurrent = document.querySelector('.fragment.current')
    fragment.classList.add('active', 'current')

    if (formerCurrent) {
      formerCurrent.classList.remove('current')
    }

    events.emit('fragmentchanged', {
      slide: slides[state.slide],
      slideIndex: state.slide,
      previousFragmentIndex: state.fragment - 1,
      previousFragment,
      fragment,
      state
    })
  } else if (state.slide < slides.length - 1) {
    state.previousSlide = state.slide
    state.slide++

    const previousSlide = slides[state.previousSlide]
    const slide = slides[state.slide]

    previousSlide.classList.remove('active')
    slide.classList.add('active')
    state.fragment = -1
    state.previousFragment = -1

    events.emit('slidechanged', {
      previousSlideIndex: state.previousSlide,
      previousSlide,
      slide,
      state
    })
  }

  updateAppState(slides, state)
}

export const prev = (slides, state) => {
  if (state.fragment > -1) {
    state.previousFragment = state.fragment
    state.fragment--
    const fragments = [].slice.call(slides[state.slide].querySelectorAll('.fragment'))
    const previousFragment = fragments[state.previousFragment]
    const fragment = fragments[state.fragment]

    previousFragment.classList.remove('active')
    events.emit('fragmentchanged', {
      slide: slides[state.slide],
      previousFragmentIndex: state.fragment + 1,
      previousFragment,
      fragment,
      state
    })
  } else if (state.slide > 0) {
    state.previousSlide = state.slide
    state.slide--

    const previousSlide = slides[state.previousSlide]
    const slide = slides[state.slide]
    const fragments = [].slice.call(slide.querySelectorAll('.fragment'))

    previousSlide.classList.remove('active')
    slide.classList.add('active')
    state.fragment = fragments.length - 1
    state.previousFragment = state.fragment

    events.emit('slidechanged', {
      previousSlideIndex: state.slide + 1,
      previousSlide,
      slide,
      state
    })

    updateAppState(slides, state)
  }
}

const updateAppState = (slides, state) => {
  const app = document.querySelector('#app')
  const slide = slides[state.slide]
  const fragment = state.fragment > 0 && (
    slide.querySelector(`.fragment:nth-child(${state.fragment - 1})`)
  )

  for (let prop in app.dataset) { delete app.dataset[prop] }
  for (let prop in slide.dataset) { app.dataset[`slideState${upperFirst(prop)}`] = slide.dataset[prop] }
  if (fragment) for (let prop in fragment.dataset) { app.dataset[`fragmentState${upperFirst(prop)}`] = fragment.dataset[prop] }
}
