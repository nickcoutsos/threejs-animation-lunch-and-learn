import * as viewer from '../../viewer'
import { box, grid, axes } from './components'

box.position.set(0, .5, 0)
axes.position.set(-5, 0, -5)

export const activate = () => {
  viewer.camera.position.set(-2.5, 5, 5)
  viewer.camera.lookAt(0, 0, 0)
  viewer.renderFrame()
}

export const deactivate = () => {
  viewer.scene.remove(box, grid, axes)
  viewer.renderFrame()
}

export const fragment = (state) => {
  if (state.fragment > state.previousFragment) {
    if (state.fragment === 0) {
      viewer.scene.add(box)
    } else if (state.fragment === 1) {
      viewer.scene.add(grid, axes)
    }
  } else {
    if (state.fragment === 0) {
      viewer.scene.remove(grid, axes)
    } else if (state.fragment === -1) {
      viewer.scene.remove(box)
    }
  }

  viewer.renderFrame()
}
