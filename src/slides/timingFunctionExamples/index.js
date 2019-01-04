import { box } from './components'
import * as viewer from '../../viewer'
import animation from '../../animation'

box.position.set(0, 0, 2.5)
box.visible = false
viewer.scene.add(box)

const position = value => {
  box.position.set(value * 4, 0, 3.5)
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
      duration: 2000,
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
      duration: 2000,
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
      duration: 2000,
      repeat: true,
      timingFunction: t => (Math.sin(t * 2*Math.PI) + 1) / 2,
      reverseOptions: {
        duration: 0,
        repeat: false
      }
    })
  },
  bounce: {
    animation: animation(y => {
      box.position.set(2.5, 4 * (1 - y), 3.5)
      viewer.renderFrame()
    }, {
      duration: 2000,
      repeat: true,
      timingFunction: t => {
        if (t < 1/2.75) {
          return 7.5625*t*t
        } else if (t < (2/2.75)) {
          return 7.5625*(t-=(1.5/2.75))*t + .75;
        } else if (t < (2.5/2.75)) {
          return 7.5625*(t-=(2.25/2.75))*t + .9375
        } else {
          return 7.5625*(t-=(2.625/2.75))*t + .984375
        }
      },
      reverseOptions: {
        duration: 0,
        repeat: false
      }
    })
  }
}
