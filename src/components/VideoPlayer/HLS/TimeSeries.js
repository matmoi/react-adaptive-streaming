import React from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';

import { VictoryLegend, VictoryAxis, VictoryLine, VictoryChart, VictoryBar } from 'victory';
import Colors from "../../utils/Colors.js";
import { Tabs, Tab } from 'react-bootstrap';

export default class HLSTimeSeries extends React.Component {
    
    constructor(...args) {
        super(...args);
        this.state = {
            fragments: {audio:[],main:[]}
        };
    }

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
            this.mediaPlayer.destroy();
            this.mediaPlayer = null;
        }
    }
    
    listenMediaPlayer() {
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

    render() {
        return (
                <Tabs defaultActiveKey={2} animation={false} id="hls-timeseries-tabs">
                    <Tab eventKey={1} title="Network">
                    {/*{ (videoBufferLevel.length > 0 || audioBufferLevel.length > 0) &&
                        <MediaTimeSeries VideoTimeSerie={videoBufferLevel} AudioTimeSerie={audioBufferLevel} x="t" y="level" yAxisLabel="Buffer level (s)" yAxisTickFormat={(tick) => tick / 1000} xAxis={xAxis}/>
                    }
                    { (videoHttpList.length > 0 || audioHttpList.length > 0) &&
                        <div>
                            <MediaTimeSeries VideoTimeSerie={videoHttpList} AudioTimeSerie={audioHttpList} x="trequest" y="interval" yAxisLabel="Latency (s)" yAxisTickFormat={(tick) => tick / 1000} xAxis={xAxis}/>
                            <MediaTimeSeries VideoTimeSerie={videoHttpList} AudioTimeSerie={audioHttpList} x="trequest" y={x => x.bytes * 8 / x.interval} yAxisLabel="Download (kbps)" xAxis={xAxis} interpolation="bundle"/>
                        </div>
                    }
                    { (videoSchedulingInfo.length > 0 || audioSchedulingInfo.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoSchedulingInfo} AudioTimeSerie={audioSchedulingInfo} x="t" y="quality" yAxisLabel="QualityIdx" xAxis={xAxis} interpolation="stepAfter"/>
                    }*/}
                </Tab>
                    <Tab eventKey={2} title="Presentation">
                    {/*{ (videoSchedulingInfo.length > 0 || audioSchedulingInfo.length > 0) &&
                            this.renderMediaSegmentSizeBarChart(videoSchedulingInfo, audioSchedulingInfo)
                    }*/}
                </Tab>
            </Tabs>
        );
    }
};

HLSTimeSeries.propTypes = {
    mediaPlayer: PropTypes.object
};