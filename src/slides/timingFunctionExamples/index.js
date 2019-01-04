import { box } from './components'
import * as viewer from '../../viewer'
import animation from '../../animation'

box.position.set(0, 0, 2.5)
box.visible = false
viewer.scene.add(box)

const position = x => {
  box.position.x = x * 4
  viewer.renderFrame()
}

export const activate = () => {
  box.visible = true
  viewer.renderFrame()
}

export const deactivate = () => {
  box.visible = false
  viewer.renderFrame()
}

export const fragments = {
  linear: {
    animation: animation(position, {
      duration: 3000,
      repeat: true,
      timingFunction: t => t,
      reverseOptions: {
        duration: 0,
        repeat: false
      }
    })
  },
  quadratic: {
    animation: animation(position, {
      duration: 3000,
      repeat: true,
      timingFunction: t => Math.pow(t, 2),
      reverseOptions: {
        duration: 0,
        repeat: false
      }
    })
  },
  sinusoidal: {
    animation: animation(position, {
      duration: 3000,
      repeat: true,
      timingFunction: t => Math.sin(t * 2*Math.PI),
      reverseOptions: {
        duration: 0,
        repeat: false
      }
    })
  }
}
