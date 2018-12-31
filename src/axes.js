import * as three from 'three'

const red = new three.MeshStandardMaterial({
  name: 'red',
  color: 'red',
  emissive: 'white',
  emissiveIntensity: 0.4,
  roughness: 0.7,
  metalness: 0.5
})

const green = new three.MeshStandardMaterial({
  name: 'green',
  color: 'green',
  emissive: 'white',
  emissiveIntensity: 0.4,
  roughness: 0.7,
  metalness: 0.5
})

const blue = new three.MeshStandardMaterial({
  name: 'blue',
  color: 'blue',
  emissive: 'white',
  emissiveIntensity: 0.4,
  roughness: 0.7,
  metalness: 0.5
})

export default (size) => {
  const container = new three.Object3D()
  const x = new three.Mesh(new three.CylinderGeometry(.1, .1, size), red)
  const y = new three.Mesh(new three.CylinderGeometry(.1, .1, size), green)
  const z = new three.Mesh(new three.CylinderGeometry(.1, .1, size), blue)

  x.position.set(size/2, 0, 0)
  x.rotation.z = Math.PI/2
  y.position.set(0, size/2, 0)
  z.position.set(0, 0, size/2)
  z.rotation.x = Math.PI/2

  return container.add(x, y, z)
}
