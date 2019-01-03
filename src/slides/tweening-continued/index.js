import * as components from './components'
import * as viewer from '../../viewer'
import animation from '../../animation'

components.opacityTweenGroup.visible = false
components.rgbTweenGroup.visible = false
components.hslTweenGroup.visible = false

viewer.scene.add(
  components.opacityTweenGroup,
  components.rgbTweenGroup,
  components.hslTweenGroup
)

export const activate = () => {
  components.opacityTweenGroup.visible = true
  viewer.renderFrame()
}

export const deactivate = () => {
  components.opacityTweenGroup.visible = false
  components.rgbTweenGroup.visible = false
  components.hslTweenGroup.visible = false
  viewer.renderFrame()
}

export const fragments = {
  tweenOpacity: {
    animation: animation(t => {
      const steps = components.opacityTweenSteps.children

      for (let i = 0; i < steps.length; i++) {
        steps[i].visible = (i + 1) / steps.length <= t
      }

      viewer.renderFrame()
    }, {
      duration: 1000,
      reverseOptions: { duration: 100 }
    })
  },
  tweenColour: {
    animation: animation(t => {
      components.opacityTweenGroup.visible = t === 0
      components.rgbTweenGroup.visible = t > 0
      viewer.renderFrame()
    }, { duration: 0 })
  },
  tweenColourRGB: {
    animation: animation(t => {
      const steps = components.rgbTweenSteps.children

      for (let i = 0; i < steps.length; i++) {
        steps[i].visible = (i + 1) / steps.length <= t
      }

      viewer.renderFrame()
    }, {
      duration: 1000,
      reverseOptions: { duration: 100 }
    })
  },
  tweenColourHSL: {
    animation: animation(t => {
      const steps = components.hslTweenSteps.children

      components.rgbTweenGroup.visible = t === 0
      components.hslTweenGroup.visible = t > 0

      for (let i = 0; i < steps.length; i++) {
        steps[i].visible = (i + 1) / steps.length <= t
      }

      viewer.renderFrame()
    }, {
      duration: 1000,
      reverseOptions: { duration: 100 }
    })
  }
}
