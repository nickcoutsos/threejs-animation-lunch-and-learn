import { Box3, DoubleSide, MeshStandardMaterial, Object3D, ObjectLoader } from 'three'

export const ergodox = new Object3D()
export const dactyl = new Object3D()
export const inBetween = new Object3D()

const createIndex = obj => {
  const index = {}
  obj.traverse(node => {
    if (node.userData.id) {
      index[node.userData.id] = node
    }
  })

  return index
}

export const red = new MeshStandardMaterial({
  color: 'firebrick',
  emissive: 'white',
  emissiveIntensity: 0.1,
  roughness: 0.7,
  metalness: 0.5,
  transparent: true,
  opacity: 0.5,
  side: DoubleSide
})

export const green = new MeshStandardMaterial({
  color: 'mediumseagreen',
  emissive: 'white',
  emissiveIntensity: 0.1,
  roughness: 0.7,
  metalness: 0.5,
  transparent: true,
  opacity: 0.5,
  side: DoubleSide
})

export const yellow = new MeshStandardMaterial({
  color: 'orange',
  emissive: 'white',
  emissiveIntensity: 0.1,
  roughness: 0.7,
  metalness: 0.5
})

ergodox.visible = false
ergodox.rotation.x = -Math.PI / 2

dactyl.visible = false
dactyl.rotation.x = -Math.PI / 2

inBetween.visible = false

const loader = new ObjectLoader()

loader.load('assets/keyboard-ergodox.json', obj => {
  ergodox.add(obj)
  ergodox.userData.index = createIndex(ergodox)
  ergodox.userData.boundingBox = new Box3().expandByObject(obj)
  ergodox.traverse(node => {
    if (node.material) {
      node.material = red
    }
  })

  inBetween.add(obj.clone())
  inBetween.userData.index = createIndex(inBetween)
  inBetween.traverse(node => {
    if (node.material) {
      node.material = yellow
    }
  })
}, () => {}, err => console.error(err))

loader.load('assets/keyboard-dactyl.json', obj => {
  dactyl.add(obj)
  dactyl.userData.index = createIndex(dactyl)
  dactyl.traverse(node => {
    if (node.isMesh) {
      node.material = green
    }
  })
}, () => {}, err => console.error(err))
