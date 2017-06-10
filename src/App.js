import React, { Component } from 'react'
import { PageHeader } from 'react-bootstrap'
import Player from './components/VideoPlayer/Player.js'

class App extends Component {
  render() {
    return (
      <div>
          <PageHeader>Videojs ABR dashboard <small> HLS and DASH stream compliance tool</small></PageHeader>
          <Player sources={ [{
            //src:'/media/BigBuckBunny/BigBuckBunny_320x180_av_dash.mpd',
            src:'/media/ElephantsDream/stream.mpd',
            type:'application/dash+xml' }
          ] }/>
      </div>
    );
  }
}

export default App;
