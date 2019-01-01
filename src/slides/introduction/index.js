import { Object3D } from 'three'
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

export const fragmentTransitions = {
  cube: {
    duration: 0,
    render: t => {
      if (t === 0) {
        // The shadow map will only update if there is at least one visible
        // object that casts a shadow. To be sure that this shadow will be
        // cleared I have to render a frame of the box without a shadow before
        // removing the box altogether.
        box.castShadow = false
        viewer.renderFrame()
        box.visible = false
      } else if (t === 1) {
        box.visible = true
        box.castShadow = true
      }

      viewer.renderFrame()
    }
  },
  grid: {
    duration: 0,
    render: t => {
      grid.visible = axes.visible = t > .5
      viewer.renderFrame()
    }
  }
}
