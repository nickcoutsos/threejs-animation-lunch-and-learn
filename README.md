# _three.js_ Animation Lunch and Learn

Slides I put together for a lunch and learn session on _three.js_ animations.

Topics:

* tweening
* timing functions
* threejs basics - scene graph and transforms
* breakdown of animations from older presentations

## Usage

```bash
git clone https://github.com/nickcoutsos/threejs-animation-lunch-and-learn
cd threejs-animation-lunch-and-learn
npm install
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

## Technology

* It's using _parcel_ because I don't have patience for anything else.
* It also uses an outdated version of _three_ because they recently deprecated
  the JSON loader and I don't want to deal with gltf exporting.
* It integrates with a small websocket server ([sync-slide-server](https://github.com/nickcoutsos/sync-slide-server))
  so that a presenter can broadcast slide change events to viewers.
