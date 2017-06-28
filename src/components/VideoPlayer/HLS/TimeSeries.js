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
            fragments: []
        };
    }

    componentDidMount() {
        const { mediaPlayer } = this.props;
        this.observeMediaPlayer(mediaPlayer);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mediaPlayer !== nextProps.mediaPlayer) {
            this.observeMediaPlayer(nextProps.mediaPlayer);
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.mediaPlayer.off(Hls.Events.FRAG_LOADED, null);
            this.mediaPlayer = null;
        }
    }
    
    observeMediaPlayer(mediaPlayer) {
        if (mediaPlayer) {
            mediaPlayer.on(Hls.Events.FRAG_LOADED,
                function (event, data ) {
                    let fragments = this.state.fragments;
                    fragments.push(data);
                    this.setState(fragments);
                }.bind(this)
            )
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