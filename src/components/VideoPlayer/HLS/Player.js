import Hls from 'hls.js';
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import HLSInfo from './Info.js';
import HLSTimeSeries from './TimeSeries.js';

export default class HLSPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.mediaPlayer = null;
    }


    componentDidMount() {
        this.mediaPlayer = new Hls();
        this.mediaPlayer.attachMedia(this.videoNode);
        this.mediaPlayer.on(Hls.Events.MANIFEST_LOADED, () => {
            this.forceUpdate();
        })
        if (this.props.sources.length > 0) {
            this.mediaPlayer.loadSource(this.props.sources[0].src);
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.mediaPlayer.destroy();
            this.mediaPlayer = null;
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // Do we need to change videojs player source ?
        if (this.mediaPlayer && nextProps.sources.length > 0) {
            for (let i = 0; i < nextProps.sources.length; i++) {
                if (!this.props.sources[i] || nextProps.sources[i].src !== this.props.sources[i].src) {
                    this.mediaPlayer.destroy();
                    this.mediaPlayer = new Hls();
                    this.mediaPlayer.attachMedia(this.videoNode);
                    this.mediaPlayer.on(Hls.Events.MANIFEST_LOADED, () => {
                        this.forceUpdate();
                    })
                    this.mediaPlayer.loadSource(nextProps.sources[0].src);
                    break;
                }
            }
        }
    }

    // wrap the player in a div with a `data-vjs-player` attribute
    // so videojs won't create additional wrapper in the DOM
    // see https://github.com/videojs/video.js/pull/3856
    render() {
        return (
            <Row>
                <Col md={4}>
                    <HLSInfo mediaPlayer={this.mediaPlayer} />
                </Col>
                <Col md={6}>
                    <video autoPlay controls ref={node => this.videoNode = node} style={{ width: "100%" }} />
                    <HLSTimeSeries mediaPlayer={this.mediaPlayer} />
                </Col>
                <Col md={1}>
                    <code>Overall metrics (TBD)</code>
                </Col>
            </Row>
        );
    }
};

HLSPlayer.propTypes = {
    autoplay: PropTypes.bool,
    sources: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string,
        type: PropTypes.string,
    }))
};

HLSPlayer.defaultProps = {
    autoplay: true,
    sources: []
};