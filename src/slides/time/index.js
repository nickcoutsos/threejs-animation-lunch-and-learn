import animation from '../../animation'
import * as viewer from '../../viewer'
import { box } from './components'

viewer.scene.add(box)
box.visible = false

export const activate = () => {
  box.visible = true
}

export const deactivate = () => {
  box.visible = false
}

export const fragments = {
  fixedStep: {
    animation: animation(t => {
      box.position.x = Math.round(t * 5) + (t > .5 ? -5 : 0)
      viewer.renderFrame()
    }, {
      duration: 2000,
      repeat: true,
      reverseOptions: {
        duration: 0,
        repeat: false
      }
    })
  },
  timeStep: {
    animation: animation(t => {
      box.position.x = t * 5 + (t > .5 ? -5 : 0)
      viewer.renderFrame()
    }, {
      duration: 2000,
      repeat: true,
      reverseOptions: {
        duration: 0,
        repeat: false
      }
    })
  }
}
