import * as viewer from '../../viewer'
import { box, grid, axes } from './components'

box.position.set(0, .5, 0)
axes.position.set(-5, 0, -5)

export const activate = () => {
  viewer.camera.position.set(-2.5, 5, 5)
  viewer.camera.lookAt(0, 0, 0)
}

export const deactivate = () => {
  viewer.scene.remove(box, grid, axes)
}

export const fragmentActivators = {
  cube: {
    activate: () => viewer.scene.add(box),
    deactivate: () => viewer.scene.remove(box)
  },
  grid: {
    activate: () => viewer.scene.add(grid, axes),
    deactivate: () => viewer.scene.remove(grid, axes)
  }
}
