import React from 'react'
import PropTypes from 'prop-types'
import videojs from 'video.js'
import 'videojs-contrib-dash'
import 'video.js/dist/video-js.min.css'
import PlayerStream from './PlayerStream.js'
import PlayerInfo from './PlayerInfo.js'
import { PageHeader, Col, Row, Grid } from 'react-bootstrap'
import Info from './Dash/Info.js'

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
    const isDash = this.player ? this.player.dash != null : false
    return (
      <div>
        <PageHeader>
          <span>
            Videojs ABR dashboard <small> HLS and DASH stream compliance tool</small>
          </span>
          <span style={ {float:"right"} }>
            <PlayerInfo player={this.player} playerready={ this.state.playerready }/>
          </span>
        </PageHeader>
        <Grid fluid={ true }>
          <Row className="show-grid">
            <Col md={3}>
              {isDash ? (
                <Info player={ this.player } />
              ) : (
                <PlayerStream player={ this.player } loadedmetadata={ this.state.loadedmetadata }/>
              )}
            </Col>
            <Col md={5}>
              <div data-vjs-player className="player">
                <video ref={ node => this.videoNode = node } className="video-js vjs-default-skin" data-setup='{"fluid": true}'></video>
              </div>
            </Col>
            <Col md={4}>
              <code>Event logs</code>
            </Col>
          </Row>
        </Grid>
      </div>
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
  sources: [{
    src:'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
    type:'video/mp4'}
  ]
};