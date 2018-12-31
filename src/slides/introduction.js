import * as three from 'three'
import * as viewer from '../viewer'

const box = new three.Mesh(
  new three.BoxGeometry(1, 1, 1)
)

export const activate = () => {
  viewer.scene.add(box)
  viewer.renderFrame()
}

export const deactivate = () => {
  viewer.scene.remove(box)
  viewer.renderFrame()
}
