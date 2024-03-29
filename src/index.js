import 'microlight'
import get from 'lodash/get'
import * as viewer from './viewer'
import * as slideshow from './slideshow'
import * as sync from './sync'
import slides from './slides'

viewer.init()
viewer.renderFrame()

let activeAnimation;

Object.keys(slides).forEach(name => {
  const slide = slides[name]
  if (slide.initialize) {
    slide.initialize()
  }
})

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}

function progress () {
  const meter = document.querySelector('#meter')
  const totalLength = (
    document.querySelectorAll('.slide').length +
    document.querySelectorAll('.fragment').length
  )

  return function setProgress (index) {
    const progressBarWidth = index / (totalLength - 1) * 100
    meter.style.width = `${progressBarWidth}vw`
  }
}

const setProgress = progress()

slideshow.events.on('slidechanged', ({ previousSlide, slide, state }) => {
  setProgress(state.absolute)

  if (activeAnimation) {
    activeAnimation.stop({ playEnd: true })
  }

  const prevSlideName = previousSlide && previousSlide.dataset.slide
  const nextSlideName = slide.dataset.slide
  if (prevSlideName && slides[prevSlideName]) {
    slides[prevSlideName].deactivate && slides[prevSlideName].deactivate(state)
  }
  if (nextSlideName && slides[nextSlideName]) {
    slides[nextSlideName].activate && slides[nextSlideName].activate(state)
  }
  viewer.renderFrame()
})

slideshow.events.on('fragmentchanged', ({ slide, state, fragment, previousFragment }) => {
  setProgress(state.absolute)

  const slideDetails = get(slides, slide.dataset.slide)
  const rollback = state.previousFragment > state.fragment
  const fragmentElement = rollback ? previousFragment : fragment
  const fragmentName = get(fragmentElement, 'dataset.fragment')
  const fragmentDetails = get(slideDetails, `fragments.${fragmentName}`)
  const fragmentState = get(fragmentElement, 'dataset.fragmentState')
  const fragmentAnimation = get(slideDetails, `fragments.${fragmentName}.animation`)

  let playbackOptions = {}
  if (state.durationOverride !== null) {
    playbackOptions.duration = state.durationOverride
  }

  if (activeAnimation && fragmentAnimation !== activeAnimation) {
    activeAnimation.stop({ playEnd: true })
  }

  activeAnimation = fragmentAnimation

  if (fragmentDetails && fragmentState) {
    fragmentDetails.state = fragmentState
  }

  if (activeAnimation && rollback) {
    activeAnimation.reverse(playbackOptions)
  } else if (activeAnimation) {
    activeAnimation.start(playbackOptions)
  }
})

document.addEventListener('keypress', ({ key }) => {
  if (key.toLowerCase() === 'f') {
    toggleFullScreen()
  }
})

document.addEventListener('fullscreenchange', () => {
  viewer.resize()

  const app = document.querySelector('#app')
  app.style.height = 'calc(100vh + 1px)'
  setTimeout(() => { app.style.height = null })
})

slideshow.initialize()

window.addEventListener('keyup', ({ key }) => {
  if (key === 'ArrowRight' || key === ' ') slideshow.next()
  else if (key === 'ArrowLeft') slideshow.prev()
  else {
    return
  }

  if (slideshow.state.usePresenterState) {
    slideshow.setState({ usePresenterState: false })
  }
})

document.querySelector('#secret').addEventListener('click', () => {
  document.querySelector('#menu').classList.toggle('active')
})

document.querySelector('#menu [name="fullscreen"]').addEventListener('click', toggleFullScreen)
document.querySelector('#menu [name="auth"]').addEventListener('click', () => sync.presenter())
document.querySelector('#menu [name="close"]').addEventListener('click', () => {
  document.querySelector('#menu').classList.remove('active')
})

document.querySelector('#sync').addEventListener('click', () => {
  slideshow.seekTo(slideshow.state.presenterState)
})

sync.init()
