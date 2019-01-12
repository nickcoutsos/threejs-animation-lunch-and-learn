import { Object3D, Vector3 } from 'three'
import { easeOut, linear } from 'easing-utils'
import { ergodox, dactyl, inBetween, green, red, yellow } from './components'
import * as viewer from '../../viewer'
import animation from '../../animation'

const wrapper = new Object3D()

wrapper.add(ergodox, dactyl, inBetween)
viewer.scene.add(wrapper)

const keyboardTween = timingFunction => t => {
  inBetween.visible = t > 0
  inBetween.traverse(node => {
    const { id } = node.userData
    if (!id) {
      return
    }

    const src = getTransforms(ergodox.userData.index[id])
    const dst = getTransforms(dactyl.userData.index[id], src)
    const f = timingFunction(t, node)

    node.scale.copy(src.scale).lerp(dst.scale, f)
    node.position.copy(src.position).lerp(dst.position, f)
    node.quaternion.copy(src.quaternion).slerp(dst.quaternion, f)
  })

  viewer.renderFrame()
}

const getTransforms = (node, fallback) => {
  const obj = new Object3D()
  const copy = node || fallback

  obj.scale.copy(copy.scale)
  copy.getWorldPosition(obj.position)
  copy.getWorldQuaternion(obj.quaternion)

  if (!node) {
    obj.position.setComponent(1, -5)
    obj.scale.set(1, 1, 1).multiplyScalar(1e-6)
  }

  return obj
}

export const activate = () => {
  wrapper.visible = true
  dactyl.visible = false
  inBetween.visible = false
  viewer.camera.position.set(-5, 12, 10)
  viewer.camera.lookAt(0, 2, 0)
  viewer.renderer.shadowMap.enabled = false
  viewer.renderFrame()
}

export const deactivate = () => {
  viewer.camera.position.set(-2.5, 5, 5)
  viewer.renderer.shadowMap.enabled = true
  wrapper.visible = false
  viewer.renderFrame()
}

export const fragments = {
  ergodox: {
    animation: animation(t => {
      ergodox.visible = t > 0
      red.opacity = Math.ceil(t) * 0.5
      viewer.renderer.clear()
      viewer.renderFrame()
    }, { duration: 0 })
  },
  dactyl: {
    animation: animation(t => {
      dactyl.visible = t > 0
      green.opacity = Math.ceil(t) * 0.5
      red.opacity = Math.ceil(t) * 0.5
      viewer.renderer.clear()
      viewer.renderFrame()
    }, { duration: 0 })
  },
  tween: {
    regularKeyboardTween: keyboardTween(linear),
    animation: animation(t => {
      yellow.opacity = t * .5
      green.opacity = (1 - t) * .5
      red.opacity = t > 0 ? t * .5 : .5
      fragments.tween.regularKeyboardTween(t)
    }, {
      duration: 1000,
      timingFunction: easeOut,
      reverseOptions: { duration: 100 }
    })
  },
  waveTime: {
    animation: animation(keyboardTween(t => (
      (Math.sin(t * 2*Math.PI) + 1) / 2
    )), {
      duration: 1500,
      repeat: true,
      reverseOptions: {
        duration: 100,
        repeat: false
      }
    })
  },
  waveTimeX: {
    animation: animation(keyboardTween((t, node) => {
      const size = new Vector3()
      ergodox.userData.boundingBox.getSize(size)

      const { id } = node.userData
      const src = getTransforms(ergodox.userData.index[id])
      const x = (src.position.x + size.x/2) / size.x
      // const z = (src.position.z + size.z/2) / size.z
      const f = (Math.sin((t + x) * 2*Math.PI) + 1) / 2

      return f
    }), {
      duration: 1500,
      repeat: true,
      reverseOptions: {
        duration: 100,
        repeat: false
      }
    })
  }
}
