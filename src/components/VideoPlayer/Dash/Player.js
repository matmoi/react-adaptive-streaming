import dashjs from 'dashjs'
import React from 'react'
import PropTypes from 'prop-types'
import DashInfo from './Info.js'
import { Col, Row } from 'react-bootstrap'

export default class DashPlayer extends React.Component {

  constructor(props) {
    super(props)
    this.mediaPlayer = null
    this.state = {
      loadedmetadata: false
    }
  }


  componentDidMount() {
    this.mediaPlayer= dashjs.MediaPlayer().create();
    this.mediaPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_METADATA_LOADED, () => {
        this.setState({ loadedmetadata: true })
    });
    if (this.props.sources.length > 0) {
        this.mediaPlayer.initialize(this.videoNode, this.props.sources[0].src, this.props.autoplay)
    }
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
      for(let i = 0;i < nextProps.sources.length; i++) {
        if (!this.props.sources[i] || nextProps.sources[i].src !== this.props.sources[i].src) {
            this.mediaPlayer.initialize(this.videoNode, nextProps.sources[0].src, true)
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
            <DashInfo mediaPlayer={this.mediaPlayer} />}
        </Col>
        <Col md={6}>
            <video data-dashjs-player autoplay controls ref={node => this.videoNode = node} style={{width:"100%"}} />
        </Col>
        <Col md={1}>
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