import * as three from 'three'
import createAxes from '../../axes'

export const box = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshStandardMaterial({
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

const plane = new three.Mesh(
  new three.PlaneGeometry(10, 10),
  new three.MeshStandardMaterial({
    color: 'white',
    opacity: 0.25,
    transparent: true
  })
)

plane.receiveShadow = true
plane.rotation.x = -Math.PI/2

export const grid = new three.GridHelper(10, 10, 'lightgray').add(plane)
