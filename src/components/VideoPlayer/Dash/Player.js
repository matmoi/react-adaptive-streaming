import dashjs from 'dashjs'
import React from 'react'
import PropTypes from 'prop-types'
import DashInfo from './Info.js'
import DashTimeSeries from './TimeSeries.js'
import { Col, Row } from 'react-bootstrap'
import ControlBar from './ControlBar.js'

export default class DashPlayer extends React.Component {

  constructor(...args) {
    super(...args)
    this.mediaPlayer = null
  }

  componentDidMount() {
    this.mediaPlayer =  dashjs.MediaPlayer().create();
    this.mediaPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_METADATA_LOADED, () => {
      this.forceUpdate()
    });
    this.mediaPlayer.initialize(this.videoNode, this.props.sources.length > 0 ? this.props.sources[0].src : null, this.props.autoplay)
    var controlbar = new ControlBar(this.mediaPlayer)
    controlbar.initialize()
  }

  componentWillUnmount() {
    if (this.mediaPlayer) {
      this.mediaPlayer.reset()
      this.mediaPlayer = null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Do we need to change videojs player source ?
    if (this.mediaPlayer && nextProps.sources.length > 0) {
      for (let i = 0; i < nextProps.sources.length; i++) {
        if (!this.props.sources[i] || nextProps.sources[i].src !== this.props.sources[i].src) {
          this.mediaPlayer.attachSource(nextProps.sources[0].src)
          break
        }
      }
    }
    return true
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <Row>
        <Col md={4}>
          <DashInfo mediaPlayer={this.mediaPlayer} />
        </Col>
        <Col md={6}>
          <video data-dashjs-player autoPlay controls ref={node => this.videoNode = node} style={{ width: "100%" }} />
            <div id="videoController" className="video-controller unselectable">
    <div id="playPauseBtn" className="btn-play-pause" title="Play/Pause">
        <span id="iconPlayPause" className="icon-play"></span>
    </div>
    <span id="videoTime" className="time-display">00:00:00</span>
    <div id="fullscreenBtn" className="btn-fullscreen control-icon-layout" title="Fullscreen">
        <span className="icon-fullscreen-enter"></span>
    </div>
    <div id="bitrateListBtn" className="control-icon-layout" title="Bitrate List">
        <span className="icon-bitrate"></span>
    </div>
    <input type="range" id="volumebar" className="volumebar" value="1" min="0" max="1" step=".01"/>
    <div id="muteBtn" className="btn-mute control-icon-layout" title="Mute">
        <span id="iconMute" className="icon-mute-off"></span>
    </div>
    <div id="trackSwitchBtn" className="control-icon-layout" title="A/V Tracks">
        <span className="icon-tracks"></span>
    </div>
    <div id="captionBtn" className="btn-caption control-icon-layout" title="Closed Caption">
        <span className="icon-caption"></span>
    </div>
    <span id="videoDuration" className="duration-display">00:00:00</span>
    <div className="seekContainer">
        <input type="range" id="seekbar" value="0" className="seekbar" min="0" step="0.01"/>
    </div>
</div>
          <DashTimeSeries mediaPlayer={this.mediaPlayer} />
        </Col>
        <Col md={1}>
          <code>Overall metrics (TBD)</code>
        </Col>
      </Row>
    )
  }
}

DashPlayer.propTypes = {
  autoplay: PropTypes.bool,
  sources: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
    type: PropTypes.string,
  }))
}

DashPlayer.defaultProps = {
  autoplay: true,
  sources: []
}