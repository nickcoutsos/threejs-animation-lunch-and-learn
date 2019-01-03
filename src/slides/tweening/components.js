import * as three from 'three'

export const source = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshStandardMaterial({
    color: 'mediumseagreen',
    emissive: 'white',
    emissiveIntensity: 0.1,
    roughness: 0.7,
    metalness: 0.5
  })
)

export const dest = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshStandardMaterial({
    color: 'firebrick',
    emissive: 'white',
    emissiveIntensity: 0.1,
    roughness: 0.7,
    metalness: 0.5
  })
)

export const ghost = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshStandardMaterial({
    color: 'lemonchiffon',
    emissive: 'white',
    emissiveIntensity: 0.1,
    roughness: 0.7,
    metalness: 0.5,
    side: three.DoubleSide,
    transparent: true,
    opacity: 0.5
  })
)

source.position.x = -5
source.position.y = .5
dest.position.x = 5
dest.position.y = .5
