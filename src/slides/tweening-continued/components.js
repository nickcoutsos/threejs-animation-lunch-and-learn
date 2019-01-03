import * as three from 'three'

const tweenSteps = 5

export const yellow = new three.Color('yellow')
export const magenta = new three.Color('magenta')

export const source = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshStandardMaterial({
    name: 'primary',
    color: yellow,
    emissive: 'white',
    emissiveIntensity: 0.1,
    roughness: 0.7,
    metalness: 0.5
  })
)

export const dest = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshStandardMaterial({
    name: 'primary',
    color: magenta,
    emissive: 'white',
    emissiveIntensity: 0.1,
    roughness: 0.7,
    metalness: 0.5
  })
)

source.position.x = -5
dest.position.x = 5

export const opacityTweenGroup = new three.Object3D()
export const opacityTweenSteps = new three.Object3D()
const opacityFull = new three.Mesh(
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
const opacityZero = new three.LineSegments(
  new three.EdgesGeometry(new three.BoxGeometry(1, 1, 1)),
  new three.LineBasicMaterial({
    name: 'primary',
    color: 'dimgray',
    emissive: 'white',
    emissiveIntensity: 0.1,
    roughness: 0.7,
    metalness: 0.5,
    wireframe: true
  })
)

opacityFull.position.x = -5
opacityZero.position.x = 5

opacityTweenGroup.add(
  opacityFull,
  opacityZero,
  opacityTweenSteps
)

for (let i = 0; i < tweenSteps; i++) {
  const t = (i + 1) / (tweenSteps + 1)
  const step = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshStandardMaterial({
      name: 'primary',
      color: 'whitesmoke',
      emissive: 'white',
      emissiveIntensity: 0.1,
      roughness: 0.7,
      metalness: 0.5,
      side: three.DoubleSide,
      transparent: true,
      opacity: 1 - t
    })
  )

  step.visible = false
  step.position.x = t * 10 - 5
  opacityTweenSteps.add(step)
}

export const rgbTweenGroup = new three.Object3D()
export const rgbTweenSteps = new three.Object3D()

rgbTweenGroup.add(source, dest, rgbTweenSteps)

for (let i = 0; i < tweenSteps; i++) {
  const t = (i + 1) / (tweenSteps + 1)
  const step = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshStandardMaterial({
      name: 'primary',
      color: yellow.clone().lerp(magenta, t),
      emissive: 'white',
      emissiveIntensity: 0.1,
      roughness: 0.7,
      metalness: 0.5
    })
  )

  step.visible = false
  step.position.x = t * 10 - 5
  rgbTweenSteps.add(step)
}

export const hslTweenGroup = new three.Object3D()
export const hslTweenSteps = new three.Object3D()

hslTweenGroup.add(source.clone(), dest.clone(), hslTweenSteps)

for (let i = 0; i < tweenSteps; i++) {
  const t = (i + 1) / (tweenSteps + 1)
  const step = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshStandardMaterial({
      name: 'primary',
      color: yellow.clone().lerpHSL(magenta, t),
      emissive: 'white',
      emissiveIntensity: 0.1,
      roughness: 0.7,
      metalness: 0.5
    })
  )

  step.visible = false
  step.position.x = t * 10 - 5
  hslTweenSteps.add(step)
}
