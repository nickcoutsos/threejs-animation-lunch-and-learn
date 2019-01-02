import { Object3D } from 'three'
import animation from '../../animation'
import * as viewer from '../../viewer'
import { box, grid, axes } from './components'

const wrapper = new Object3D()
const boxOrigin = new Object3D()
box.position.set(0, .5, 0)
axes.position.set(-5, 0, -5)

viewer.scene.add(wrapper)
wrapper.add(boxOrigin, grid, axes)
boxOrigin.add(box)
box.visible = false
axes.visible = false
grid.visible = false

export const activate = () => {
  viewer.camera.position.set(-2.5, 5, 5)
  viewer.camera.lookAt(0, 0, 0)
  wrapper.visible = true
}

export const deactivate = () => {
  wrapper.visible = false
}

export const fragments = {
  cube: {
    animation: animation(t => {
      box.visible = t > .5
      viewer.renderFrame()
    }, 0)
  },
  grid: {
    animation: animation(t => {
      grid.visible = axes.visible = t > .5
      viewer.renderFrame()
    }, 0)
  },
  choppy: {
    animation: animation(t => {
      boxOrigin.position.x = Math.round(t * 5) + (t > .5 ? -5 : 0)
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
  smoother: {
    animation: animation(t => {
      boxOrigin.position.x = Math.round(t * 5 * 2) / 2 + (t > .5 ? -5 : 0)
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
