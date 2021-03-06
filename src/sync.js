import * as slideshow from './slideshow'

const syncHost = 'sync-slide.herokuapp.com'

let pictureInPicture = document.createElement('iframe')
let presenterToken = null
let socket, pingInterval

function sendUpdate ({ state }) {
  const { absolute, slide, previousSlide, fragment, previousFragment } = state
  return fetch(`https://${syncHost}/topics/threejs-animation-slides`, {
    method: 'POST',
    cors: 'cors',
    headers: { authorization: `Bearer ${presenterToken}` },
    body: JSON.stringify({ absolute, slide, previousSlide, fragment, previousFragment })
  })
}

export const init = () => {
  const url = new URL(location.href)

  if (!url.searchParams.has('isPictureInPicture')) {
    url.searchParams.set('isPictureInPicture', 'true')
    pictureInPicture.src = url.toString()
    document.querySelector('#sync').appendChild(pictureInPicture)
  }

  socket = new WebSocket(`wss://${syncHost}/topics/threejs-animation-slides`)
  socket.onopen = () => console.log(new Date(), 'connected to topic')
  socket.onmessage = (message) => {
    console.log(new Date(), 'message received', message.data)
    const newState = JSON.parse(message.data)
    slideshow.setState(Object.assign(
      slideshow.state.usePresenterState && newState,
      { presenterState: newState }
    ))
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
    pictureInPicture.parentNode.removeChild(pictureInPicture)

    sendUpdate({ state: slideshow.state }).then(res => {
      if (!res.ok) {
        return res.text().then(err => {
          console.error(err)
          window.alert('could not authenticate as presenter')
        })
      }

      socket && socket.close()
      clearInterval(pingInterval)
      slideshow.events.off('slidechanged', sendUpdate)
      slideshow.events.off('fragmentchanged', sendUpdate)
      slideshow.events.on('slidechanged', sendUpdate)
      slideshow.events.on('fragmentchanged', sendUpdate)
      slideshow.setState({ isPresenter: true })
    })
  }
}
