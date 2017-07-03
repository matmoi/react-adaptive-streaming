import React from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';

import { VictoryLegend, VictoryAxis, VictoryLine, VictoryChart, VictoryBar } from 'victory';
import Colors from '../../utils/Colors.js';
import NetworkTimeSeries from '../../utils/NetworkTimeSeries.js';
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
        this.reset();
        this.listenMediaPlayer();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mediaPlayer !== nextProps.mediaPlayer) {
            this.reset();
            this.mediaPlayer = nextProps.mediaPlayer;
            this.listenMediaPlayer();
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.reset();
            this.mediaPlayer.destroy();
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

    reset() {
        this.setState(
            {
                fragments: {audio:[],main:[]},
            }
        );
        this.currentFrag = {
            audio:null, // last played audio fragment
            main:null   // last played video fragment
        };
    }

    render() {
        if (this.state.fragments.main.length === 0 && this.state.fragments.audio.length === 0) {
            return (
                <div>
                    <code>Waiting for fragments</code>
                </div>
            );
        }
        const minTime = Math.min(
            ...[
                this.state.fragments.main.length > 0 && this.state.fragments.main[0].stats.trequest,
                this.state.fragments.audio.length > 0 && this.state.fragments.audio[0].stats.trequest
            ].filter(x => x)
        );
        const maxTime = Math.max(
            this.state.fragments.main.length > 0 ? this.state.fragments.main[this.state.fragments.main.length-1].stats.tbuffered : 0,
            this.state.fragments.audio.length > 0 ? this.state.fragments.audio[this.state.fragments.audio.length-1].stats.tbuffered : 0
        );
        const xAxis =
            <VictoryAxis
                dependentAxis={false}
                tickValues={Array.from({length: 10}, (v, k) => k*Math.max((Math.round((maxTime-minTime) / 10000) * 1000),1000) + minTime)}
                tickFormat={(x) => Math.round((x-minTime) / 1000)}
                style={{
                    axis: {stroke: "#756f6a"},
                    ticks: {stroke: "grey"},
                    tickLabels: {fontSize: 8, padding: 0}
                }}
            />;
        return (
                <Tabs defaultActiveKey={2} animation={false} id="hls-timeseries-tabs">
                    <Tab eventKey={1} title="Network">
                        <NetworkTimeSeries VideoTimeSerie={this.state.fragments.main} AudioTimeSerie={this.state.fragments.audio} x="stats.tbuffered" y="buffer.level" yAxisLabel="Buffer level (s)" xAxis={xAxis}/>
                        <NetworkTimeSeries VideoTimeSerie={this.state.fragments.main} AudioTimeSerie={this.state.fragments.audio} x="stats.trequest" y={y => y.stats.tload-y.stats.tfirst} yAxisLabel="Latency (s)" yAxisTickFormat={(tick) => tick / 1000} xAxis={xAxis}/>
                        <NetworkTimeSeries VideoTimeSerie={this.state.fragments.main} AudioTimeSerie={this.state.fragments.audio} x="stats.trequest" y={y => y.stats.bwEstimate || 0} yAxisLabel="Bw estimate (kbps)" yAxisTickFormat={(tick) => tick / 1000} xAxis={xAxis} interpolation="bundle"/>
                        <NetworkTimeSeries VideoTimeSerie={this.state.fragments.main} AudioTimeSerie={this.state.fragments.audio} x="stats.trequest" y="frag.level" yAxisLabel="QualityIdx" xAxis={xAxis} interpolation="stepAfter"/>
    
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