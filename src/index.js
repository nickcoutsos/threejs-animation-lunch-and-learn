import get from 'lodash/get'
import * as viewer from './viewer'
import * as slideshow from './slideshow'
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

slideshow.events.on('slidechanged', ({ previousSlide, slide, state }) => {
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
  const slideDetails = get(slides, slide.dataset.slide)
  const rollback = state.previousFragment > state.fragment
  const fragmentElement = rollback ? previousFragment : fragment
  const fragmentName = get(fragmentElement, 'dataset.fragment')
  const fragmentAnimation = get(slideDetails, `fragments.${fragmentName}.animation`)

  if (activeAnimation && fragmentAnimation !== activeAnimation) {
    activeAnimation.stop()
  }

  activeAnimation = fragmentAnimation

  if (activeAnimation && rollback) {
    activeAnimation.reverse()
  } else if (activeAnimation) {
    activeAnimation.start()
  }
})

document.addEventListener('keypress', ({ key }) => {
  if (key.toLowerCase() === 'f') {
    toggleFullScreen()
  }
})

document.addEventListener('fullscreenevent', () => {
  viewer.resize()
  if (document.fullScreenElement) {
    localStorage.setItem('fullscreen', '1')
  } else {
    localStorage.removeItem('fullscreen')
  }
})

slideshow.initialize()
