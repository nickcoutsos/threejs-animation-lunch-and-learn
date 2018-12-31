import { BoxGeometry, GridHelper, Mesh, MeshStandardMaterial } from 'three'
import createAxes from '../../axes'

export const box = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshStandardMaterial({
    name: 'primary',
    color: 'whitesmoke',
    emissive: 'white',
    emissiveIntensity: 0.1,
    roughness: 0.7,
    metalness: 0.5
  })
)

box.castShadow = true

export const axes = createAxes(3)
export const grid = new GridHelper(10, 10)
