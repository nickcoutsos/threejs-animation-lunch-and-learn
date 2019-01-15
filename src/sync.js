import * as slideshow from './slideshow'

const syncHost = 'sync-slide.herokuapp.com'

let presenterToken = null
let socket, pingInterval

function sendUpdate ({ state }) {
  return fetch(`https://${syncHost}/topics/threejs-animation-slides`, {
    method: 'POST',
    cors: 'cors',
    headers: { authorization: `Bearer ${presenterToken}` },
    body: JSON.stringify(state)
  })
}

export const init = () => {
  socket = new WebSocket(`wss://${syncHost}/topics/threejs-animation-slides`)

  socket.onopen = () => {
    console.log(new Date(), 'connected to topic')
  }

  socket.onmessage = (message) => {
    console.log(new Date(), 'message received', message.data)
    slideshow.setState(JSON.parse(message.data))
  }

  socket.onclose = () => {
    console.log(new Date(), 'disconnected from sync server')
  }

  socket.onerror = err => {
    console.error(new Date(), err)
  }

  pingInterval = setInterval(() => socket.send('ping'), 10000)
}

export const presenter = () => {
  const token = window.prompt()

  if (token) {
    presenterToken = token
    socket && socket.close()
    clearInterval(pingInterval)
    slideshow.events.off('slidechanged', sendUpdate)
    slideshow.events.off('fragmentchanged', sendUpdate)
    slideshow.events.on('slidechanged', sendUpdate)
    slideshow.events.on('fragmentchanged', sendUpdate)
  }
}
