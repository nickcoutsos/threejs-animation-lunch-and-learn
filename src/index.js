import get from 'lodash/get'
import * as viewer from './viewer'
import * as slideshow from './slideshow'
import slides from './slides'

viewer.init()
viewer.renderFrame()

Object.keys(slides).forEach(name => {
  const slide = slides[name]
  if (slide.initialize) {
    slide.initialize()
  }
})

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
  const nextAction = get(fragment, 'dataset.fragmentActivator')
  const nextActivator = get(slideDetails, `fragmentActivators.${nextAction}.activate`)

  if (state.previousFragment > state.fragment) {
    const prevAction = get(previousFragment, 'dataset.fragmentActivator')
    const prevActivator = get(slideDetails, `fragmentActivators.${prevAction}.deactivate`)
    prevActivator && prevActivator()
  }

  nextActivator && nextActivator()
  viewer.renderFrame()
})

slideshow.initialize()
