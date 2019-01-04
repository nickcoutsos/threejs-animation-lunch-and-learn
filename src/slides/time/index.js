import animation from '../../animation'
import * as viewer from '../../viewer'
import { box } from './components'

box.position.set(0, .5, 0)

viewer.scene.add(box)
box.visible = false

export const activate = () => {
  viewer.camera.position.set(-2.5, 5, 5)
  viewer.camera.lookAt(0, 0, 0)
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
