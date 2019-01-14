import * as slideshow from './slideshow'

let presenterToken = null
let socket

function sendUpdate ({ state }) {
  return fetch('https://sync-slide.herokuapp.com/topics/threejs-animation-slides', {
    method: 'POST',
    cors: 'cors',
    headers: { authorization: `Bearer ${presenterToken}` },
    body: JSON.stringify(state)
  })
}

export const init = () => {
  socket = new WebSocket('ws://sync-slide.herokuapp.com/topics/threejs-animation-slides')

  socket.onopen = () => {
    console.log('connected to topic')
  }

  socket.onmessage = (message) => {
    console.log('message received', message.data)
    slideshow.setState(JSON.parse(message.data))
  }
}

export const presenter = () => {
  const token = window.prompt()

  if (token) {
    presenterToken = token
    socket && socket.close()
    slideshow.events.off('slidechanged', sendUpdate)
    slideshow.events.off('fragmentchanged', sendUpdate)
    slideshow.events.on('slidechanged', sendUpdate)
    slideshow.events.on('fragmentchanged', sendUpdate)
  }
}
