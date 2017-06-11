import React, { Component } from 'react'
import Player from './components/VideoPlayer/Player.js'

class App extends Component {
  render() {
    return (
      <Player sources={ [{
        //src:'/media/BigBuckBunny/BigBuckBunny_320x180_av_dash.mpd',
        src:'/media/ElephantsDream/stream.mpd',
        type:'application/dash+xml' }
      ] }/>
    );
  }
}

export default App;
