# _three.js_ Animation Lunch and Learn

Slides I put together for a lunch and learn session on _three.js_ animations.

## Topics

* tweening
* timing functions
* threejs basics - scene graph and transforms
* breakdown of animations from older presentations

## Usage

```bash
git clone https://github.com/nickcoutsos/threejs-animation-lunch-and-learn
cd threejs-animation-lunch-and-learn
npm ci
npm start
```

This will start a dev server on `http://localhost:1234`. Or better yet use the
GitHub-hosted version of the [lunch and learn slides](https://nickcoutsos.github.io/threejs-animation-lunch-and-learn/).

Either way you can browse through the slides with the left and right arrow keys.
If you happen to be viewing this at the same time that I'm presenting you should
recieve slide change events via websocket messages for synchronized viewing for
better performance than you'd get from a video stream.

Head's up, I didn't try very hard on the responsive design, so hit <kbd>f</kbd>
to toggle fullscreen. And don't use a phone for the same reason.

## Technology and Features

* It's using _parcel_ because I don't have patience for anything else.
* It also uses an outdated version of _three_ because they recently deprecated
  the JSON loader and I don't want to deal with gltf exporting.
* It integrates with a small websocket server ([sync-slide-server](https://github.com/nickcoutsos/sync-slide-server))
  so that a presenter can broadcast slide change events to viewers. (see below!)

## Broadcast Mode

I'm going to dig in a little more here because I'm pretty proud of this feature
even though it was a one-off thing and is not functional now.

Technical constraints in the office required me to present using Zoom to screen
share both to remote participants and to the projector viewed by the local. To
avoid latency and framerate problems ruining the experience I wanted to enable
all viewers to follow along by running the same animations in their browser.

### Synchronization

I used a free Heroku dyno to accept websocket connections from the audience and
myself, using a JWT to identify my own connection as the presenter. After I've
connected all other connected clients are notified that the presentation is now
"live" and prompted to synchronize with it.

On my own computer I can navigate through the slideshow and my current position
will be published to each of the clients which will automatically advance to the
same slide.

### Temporary de-sync'd viewing

Additionally, each client is free to go back or skip ahead in the slides at
their leisure and this has two effects:

- automatically syncing to my slide position is disabled, with a button to let
  the user resume synchronized viewing when ready
- a "picture-in-picture" view of the synced presentation is shown in the corner

That picture-in-picture view is achieved with a simple `iframe` of the same web
app, with a flag to indicate that it should auto-connect to the live
presentation and disables user controls.
