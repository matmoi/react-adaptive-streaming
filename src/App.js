import React, { Component } from 'react'
import Player from './components/VideoPlayer/Player.js'

class App extends Component {
  render() {
    return (
      <Player sources={ [{src:'/media/ElephantsDream/master.m3u8', type:'application/x-mpegURL'}] }/>
    );
  }
}

export default App;
