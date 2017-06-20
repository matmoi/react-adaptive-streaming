# Introduction

react-adaptive-streaming is a web applicaton whose purpose is to demonstrate adaptive bitrate streaming techniques, namely [DASH](http://dashif.org/about/) and [HLS](https://developer.apple.com/streaming/). We use the advantage of [React component's lifecycle](https://facebook.github.io/react/docs/state-and-lifecycle.html) together with composition to swap rendering video elements from the DOM, alternatively between the three players [dash.js](https://github.com/Dash-Industry-Forum/dash.js), [hls.js](https://github.com/video-dev/hls.js/tree/master) and [videojs](https://github.com/videojs/video.js).

# Prepare media files

See [https://github.com/matmoi/create-DASH-HLS](https://github.com/matmoi/create-DASH-HLS).

# Requirements

- [nodejs](https://nodejs.org/en/download/)

> for Windows 10 users :
> I strongly recommend running npm/nodejs from the [Bash](https://msdn.microsoft.com/en-us/commandline/wsl/about) environment, it makes the installation process much less painful !

# In-browser visualization

Install depencencies with :
```
npm install
```

and run server in dev mode using :
```
npm start
```


# Similar tools

- [DashIF reference client](http://dashif.org/reference/players/javascript/latest/samples/dash-if-reference-player/index.html) (DASH only)
- [HLS.js demo page](http://video-dev.github.io/hls.js/demo/) (HLS only)