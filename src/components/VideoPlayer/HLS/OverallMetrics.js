import React from 'react';
import PropTypes from 'prop-types';

import { VictoryPie } from 'victory';
import { Label, Button, ButtonGroup, Table } from 'react-bootstrap';

import Colors from "../../utils/Colors.js"

export default class HLSOverallMetrics extends React.Component {
    mediaPlayer = null;

    componentDidMount() {
        this.mediaPlayer = this.props.mediaPlayer;
        this.listenMediaPlayer();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mediaPlayer !== nextProps.mediaPlayer) {
            this.mediaPlayer = nextProps.mediaPlayer;
            this.listenMediaPlayer();
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.mediaPlayer = null;
        }
    }
    
    listenMediaPlayer() {
        if (this.mediaPlayer) {
            this.mediaPlayer.on(Hls.Events.FRAG_BUFFERED, function(event,data) {
                // console.log(`${event} ${data.frag.type} ${data.frag.sn} ${data.frag.loadIdx}`);
                if (["audio","main"].includes(data.id) && Number.isInteger(data.frag.sn)) {
                    let frags = this.state.fragments;
                    frags[data.frag.type].push(
                        {
                            frag: data.frag,
                            stats: data.stats,
                            buffer: {
                                level: this.currentFrag[data.id] ? data.frag.startPTS - this.currentFrag[data.id].startPTS : data.frag.startPTS
                            }
                        }
                    );
                    this.setState({fragments:frags});
                }
            }.bind(this));
            this.mediaPlayer.on(Hls.Events.FRAG_CHANGED, (event,data) => {
                if (["audio","main"].includes(data.type)) {
                    this.currentFrag[data.frag.type] = data.frag;
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
}

HLSOverallMetrics.propTypes = {
    mediaPlayer: PropTypes.object
}