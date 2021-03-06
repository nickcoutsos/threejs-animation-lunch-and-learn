import { Object3D } from 'three'
import animation from '../../animation'
import * as viewer from '../../viewer'
import { box, grid, axes } from './components'

const wrapper = new Object3D()

grid.position.set(0, -0.5, 0)
axes.position.set(-5, -0.5, -5)

viewer.scene.add(wrapper)
wrapper.add(box, grid, axes)

box.visible = false
axes.visible = false
grid.visible = false

export const activate = () => {
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
      box.visible = true
      grid.visible = axes.visible = t > .5
      viewer.renderFrame()
    }, 0)
  },
  choppy: {
    animation: animation(t => {
      box.visible = true
      grid.visible = axes.visible = true
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
  smoother: {
    animation: animation(t => {
      box.visible = true
      grid.visible = axes.visible = true
      box.position.x = Math.round(t * 5 * 2) / 2 + (t > .5 ? -5 : 0)
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
