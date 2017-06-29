import React from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';

import { VictoryLegend, VictoryAxis, VictoryLine, VictoryChart, VictoryBar } from 'victory';
import Colors from "../../utils/Colors.js";
// import { Tabs, Tab } from 'react-bootstrap';

export default class HLSTimeSeries extends React.Component {
    
    constructor(...args) {
        super(...args);
        this.state = {
            fragments: {audio:[],main:[]}
        };
    }

    componentDidMount() {
        this.mediaPlayer = this.props.mediaPlayer;
        this.observeMediaPlayer();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mediaPlayer !== nextProps.mediaPlayer) {
            this.mediaPlayer = nextProps.mediaPlayer;
            this.observeMediaPlayer();
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.mediaPlayer.off(Hls.Events.FRAG_LOADED, null);
            this.mediaPlayer = null;
        }
    }
    
    observeMediaPlayer() {
        if (this.mediaPlayer) {
            this.mediaPlayer.on(Hls.Events.FRAG_LOADED, (event, data ) => {
                // console.log(`${event} ${data.frag.type} ${data.frag.sn} ${data.frag.loadIdx}`);
                if (["audio","main"].includes(data.frag.type)) {
                    let fragments = this.state.fragments;
                    fragments[data.frag.type].push(
                        {
                            frag: data.frag,
                            stats: data.stats
                        }
                    );
                    this.setState(fragments);
                }
            });
            this.mediaPlayer.on(Hls.Events.FRAG_BUFFERED, (event,data) => {
                // console.log(`${event} ${data.frag.type} ${data.frag.sn} ${data.frag.loadIdx}`);
            });
        }
    }

    render() {
        return (
            <code>TBD</code>
        );
    }
};

HLSTimeSeries.propTypes = {
    mediaPlayer: PropTypes.object
};