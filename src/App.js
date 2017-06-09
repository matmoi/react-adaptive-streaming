import React, { Component } from 'react';
import Player from './components/VideoPlayer/Player.js'
import '../public/react-adaptive-streaming.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Video.js ABR dashboard</h2>
        </div>
        <div>
          <Player sources={ [{
            //src:'/media/BigBuckBunny/BigBuckBunny_320x180_av_dash.mpd',
            src:'/media/ElephantsDream/stream.mpd',
            type:'application/dash+xml' }
          ] }/>
        </div>
      </div>
    );
  }
}

export default App;
