import * as three from 'three'

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
