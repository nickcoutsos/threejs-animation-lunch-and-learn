import * as three from 'three'
import { source, dest, ghost } from './components'
import animation from '../../animation'
import * as viewer from '../../viewer'

const tweenCount = 5

const wrapper = new three.Object3D()
const tweenedPositions = new three.Object3D()
const tweenedRotations = new three.Object3D()
const tweenedScales = new three.Object3D()

wrapper.visible = false
wrapper.add(
  source,
  dest,
  tweenedPositions,
  tweenedRotations,
  tweenedScales
)

viewer.scene.add(wrapper)

for (let i = 0; i < tweenCount; i++) {
  const t = (i + 1) / (tweenCount + 1)
  const tweenedBox = ghost.clone()
  tweenedBox.visible = false
  tweenedBox.position
    .copy(source.position)
    .lerp(dest.position, t)

  tweenedPositions.add(tweenedBox)

  const tweenedRotation = tweenedBox.clone()
  tweenedRotation.rotation.y = Math.PI / 2 * t
  tweenedRotations.add(tweenedRotation)

  const tweenedScale = tweenedBox.clone()
  tweenedScale.scale.set(1, 1, 1 + t*2)
  tweenedScales.add(tweenedScale)
}

export const activate = () => {
  wrapper.visible = true
  viewer.renderFrame()
}

export const deactivate = () => {
  wrapper.visible = false
  viewer.renderFrame()
}

export const fragments = {
  tweenedPositions: {
    animation: animation(t => {
      for (let i = 0; i < tweenCount; i++) {
        tweenedPositions.children[i].visible = (i / tweenCount) < t
      }

      viewer.renderFrame()
    }, {
      duration: 1000,
      reverseOptions: {
        duration: 100
      }
    })
  },
  tweenedRotations: {
    animation: animation(t => {
      dest.rotation.y = t === 0 ? 0 : Math.PI/2
      for (let i = 0; i < tweenCount; i++) {
        tweenedPositions.children[i].visible = t === 0
        tweenedRotations.children[i].visible = (i / tweenCount) < t
      }

      viewer.renderFrame()
    }, {
      duration: 1000,
      reverseOptions: {
        duration: 100
      }
    })
  },
  tweenedScales: {
    animation: animation(t => {
      dest.rotation.y = t === 0 ? Math.PI/2 : 0
      dest.scale.copy(
        t === 0
          ? new three.Vector3(1, 1, 1)
          : new three.Vector3(1, 1, 3)
      )

      for (let i = 0; i < tweenCount; i++) {
        tweenedRotations.children[i].visible = t === 0
        tweenedScales.children[i].visible = (i / tweenCount) < t
      }

      viewer.renderFrame()
    }, {
      duration: 1000,
      reverseOptions: {
        duration: 100
      }
    })
  }
}
