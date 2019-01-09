import { Object3D, ObjectLoader, Vector3 } from 'three'
import * as viewer from '../../viewer'

const dihedral = Math.acos(-1 / Math.sqrt(5))
const complement = Math.PI - dihedral
const loader = new ObjectLoader()

export const wrapper = new Object3D()

loader.load(
  'assets/dodecahedron.json',
  function (obj) {
    obj.traverse(node => {
      if (node.userData.isPolygon || node.userData.isElement) {
        node.visible = false
      }

      if (!node.userData.isPivot) {
        return
      }

      node.userData.pivotAxis = new Vector3().copy(node.userData.pivotAxis)
      node.userData.animate = t => {
        node.rotation.set(0, 0, 0)
        node.rotateOnAxis(node.userData.pivotAxis, t * complement)
      }
    })

    wrapper.add(obj)
    wrapper.rotation.x = -Math.PI/2
    viewer.renderFrame()
  },
  function () {},
  function (err) {
    console.error(err, 'Failed to load model')
  }
)
