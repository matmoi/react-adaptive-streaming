import Hls from 'hls.js';
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import HLSInfo from './Info.js';
import HLSTimeSeries from './TimeSeries.js';
import HLSOverallMetrics from './OverallMetrics.js';

export default class HLSPlayer extends React.Component {

    mediaPlayer = null;

    constructor(...args) {
        super(...args);
        this.state = {
            fragments: {
                audio:[],
                main:[]
            },
            currentFrag : {
                audio:null, // last played audio fragment
                main:null   // last played video fragment
            }
        };
    }

    componentDidMount() {
        this.mediaPlayer = new Hls();
        this.mediaPlayer.attachMedia(this.videoNode);
        this.mediaPlayer.on(Hls.Events.MANIFEST_LOADED, () => {
            this.forceUpdate();
        });
        this.reset();
        this.listenMediaPlayer();
        if (this.props.sources.length > 0) {
            this.mediaPlayer.loadSource(this.props.sources[0].src);
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.mediaPlayer.detachMedia();
            this.mediaPlayer.destroy();
            this.mediaPlayer = null;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sources.length > 0) {
            if (! this.mediaPlayer || this.props.sources.length === 0 || nextProps.sources[0].src !== this.props.sources[0].src) {
                if (this.mediaPlayer) {
                    this.mediaPlayer.detachMedia();
                    this.mediaPlayer.destroy();
                    this.mediaPlayer = null;
                    this.reset();
                }
                this.mediaPlayer = new Hls();
                this.mediaPlayer.attachMedia(this.videoNode);
                this.listenMediaPlayer();
                this.mediaPlayer.on(Hls.Events.MANIFEST_LOADED, () => {
                    this.forceUpdate();
                })
                this.mediaPlayer.loadSource(nextProps.sources[0].src);
            }
        }
    }

    listenMediaPlayer() {
        if (this.mediaPlayer) {
            this.mediaPlayer.on(Hls.Events.FRAG_BUFFERED, (event,data) => {
                // console.log(`${event} ${data.frag.type} ${data.frag.sn} ${data.frag.loadIdx}`);
                if (["audio","main"].includes(data.id) && Number.isInteger(data.frag.sn)) {
                    let frags = this.state.fragments;
                    frags[data.frag.type].push(
                        {
                            frag: data.frag,
                            stats: data.stats,
                            buffer: {
                                level: this.state.currentFrag[data.id] ? data.frag.startPTS - this.state.currentFrag[data.id].startPTS : data.frag.startPTS
                            }
                        }
                    );
                    this.setState({fragments:frags});
                }
            });
            this.mediaPlayer.on(Hls.Events.FRAG_CHANGED, (event,data) => {
                if (["audio","main"].includes(data.frag.type)) {
                    const currentFrag = this.state.currentFrag;
                    currentFrag[data.frag.type] = data.frag;
                    this.setState({currentFrag:currentFrag});
                }
            });
            this.mediaPlayer.on(Hls.Events.ERROR, (event, data) => {
                var errorType = data.type;
                var errorDetails = data.details;
                var errorFatal = data.fatal;

                switch(data.details) {
                case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                    // ....
                    break;
                default:
                    break;
                }
            });
        }
    }

    reset() {
        this.setState(
            {
                fragments : {
                    audio:[],
                    main:[]
                },
                currentFrag : {
                    audio:null, // last played audio fragment
                    main:null   // last played video fragment
                }
            }
        );
    }

    render() {
        return (
            <Row>
                <Col md={4}>
                    <HLSInfo mediaPlayer={this.mediaPlayer} />
                </Col>
                <Col md={6}>
                    <video autoPlay controls ref={node => this.videoNode = node} style={{ width: "100%" }} />
                    <HLSTimeSeries videoFragments={this.state.fragments.main} audioFragments={this.state.fragments.audio} />
                </Col>
                <Col md={2}>
                    <HLSOverallMetrics fragments={this.state.fragments}
                        currentLevel={{
                            main:this.mediaPlayer ? this.mediaPlayer.currentLevel : null,
                            audio:this.mediaPlayer ? this.mediaPlayer.audioTrack : null,
                        }}
                        levels={{
                            main:this.mediaPlayer ? this.mediaPlayer.levels : null,
                            audio:this.mediaPlayer ? this.mediaPlayer.audioTracks : null
                        }}/>
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