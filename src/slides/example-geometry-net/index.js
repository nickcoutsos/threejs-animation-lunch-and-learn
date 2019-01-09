import { wrapper } from './components'
import * as viewer from '../../viewer'
import animation from '../../animation'

wrapper.visible = false
viewer.scene.add(wrapper)
let animationFrame

export const activate = () => {
  wrapper.visible = true
  viewer.renderFrame()
}

export const deactivate = () => {
  wrapper.visible = false
  viewer.renderFrame()
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
}

export const fragments = {
  faces: {
    animation: animation(t => {
      wrapper.traverse(node => {
        if ('depth' in node.userData) {
          node.visible = node.userData.depth / 4 <= t
        }
      })

      viewer.renderFrame()
    }, {
      duration: 2000,
      reverseOptions: {
        duration: 100
      }
    })
  },
  pivots: {
    animation: animation(t => {
      wrapper.traverse(node => {
        if (node.userData.isElement) {
          node.visible = node.parent.parent.userData.depth / 4 <= t
        }
      })

      viewer.renderFrame()
    }, {
      duration: 2000,
      reverseOptions: {
        duration: 100
      }
    })
  },
  unfold: {
    animation: animation(t => {
      wrapper.traverse(node => {
        if (node.userData.animate) {
          node.userData.animate(t)
        }
      })

      viewer.renderFrame()
    }, {
      duration: 2000,
      reverseOptions: {
        duration: 100
      }
    })
  }
}
