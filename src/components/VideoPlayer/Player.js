import React from 'react'
import PropTypes from 'prop-types'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import 'videojs-contrib-dash'
import PlayerStream from './PlayerStream.js'
import DashStream from './DashStream.js'
import PlayerInfo from './PlayerInfo.js'

import { Col, Row, Grid } from 'react-bootstrap'

export default class VideoPlayer extends React.Component {

 constructor(props) {
    super(props)
    this.player = null
    this.state = {
      loadedmetadata : false,
      playerready : false
    }
  }


  componentDidMount() {
    // instantiate video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      this.setState({playerready: true})
      this.player.on('loadedmetadata', () => {
        this.setState({loadedmetadata: true})
      })
    }.bind(this));
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
      this.player = null
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    const isDash = this.player ? this.player.currentSource().type === 'application/dash+xml' : false
    return (
      <Grid fluid="true">
        <Row className="show-grid">
          <Col md={2}>
            <code>Event logs</code>
          </Col>
          <Col md={6}>
                <div data-vjs-player className="player">
                  <video ref={ node => this.videoNode = node } className="video-js vjs-default-skin"></video>
                </div>
          </Col>
          <Col md={4}>
            <div>
                <PlayerInfo player={this.player} playerready={ this.state.playerready }/>
            </div>
            <div>
                {isDash ? (
                  <DashStream mediaPlayer={this.player.dash.mediaPlayer} />
                ) : (
                  <PlayerStream player={this.player} loadedmetadata={ this.state.loadedmetadata }/>
                )}
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

VideoPlayer.propTypes = {
  autoplay: PropTypes.bool,
  preload: PropTypes.oneOf(['auto','metadata','none']),
  controls: PropTypes.bool,
  loop: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  sources: PropTypes.arrayOf(PropTypes.shape({
     src: PropTypes.string,
     type: PropTypes.string,
   }))
};

VideoPlayer.defaultProps = {
  autoplay: true,
  preload: "auto",
  controls: true,
  loop: false,
  width: 640,
  height: 480,
  sources: [
    {src:'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
    type:'video/mp4'}
  ]
};