import throttle from 'lodash/throttle'
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  PCFSoftShadowMap
} from 'three'

const container = document.querySelector('#app')

export const renderer = new WebGLRenderer({ antialias: true, alpha: true });
export const camera = new PerspectiveCamera(75, 1, 0.1, 1000)
export const scene = new Scene()

export const renderFrame = throttle(() => {
  renderer.render(scene, camera)
}, 16)

export const init = () => {
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
  container.appendChild(renderer.domElement)
  window.addEventListener('resize', resize)

  const ambientLight = new AmbientLight('powderblue', .8)
  const directionalLight = new DirectionalLight('white', 1)
  ambientLight.name = 'ambient'
  directionalLight.position.set(5, 5, 5)
  directionalLight.castShadow = true
  directionalLight.lookAt(0, 0, 0)
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024

  camera.position.set(-5, -10, 10)
  camera.lookAt(new Vector3(0, 4, 0))

  scene.add(
    camera,
    directionalLight,
    ambientLight
  )

  resize()
}

let resizeHandler = () => {}
export const onResize = (handler) => { resizeHandler = handler }

export function resize () {
  const { width, height } = container.getBoundingClientRect()

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  resizeHandler(width, height)
  renderFrame()
}
