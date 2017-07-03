import React from 'react';
import PropTypes from 'prop-types';
import dashjs from 'dashjs';

import { VictoryLegend, VictoryAxis, VictoryLine, VictoryChart, VictoryBar } from 'victory';
import Colors from "../../utils/Colors.js";
import NetworkTimeSeries from "../../utils/NetworkTimeSeries.js";
import { Tabs, Tab } from 'react-bootstrap';

export default class DashTimeSeries extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            lastUpdate: null
        };
        this.handleMetricChanged = this.handleMetricChanged.bind(this);
    }
    
    componentDidMount() {
        const { mediaPlayer } = this.props;
        this.listenMediaPlayer(mediaPlayer);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mediaPlayer !== nextProps.mediaPlayer) {
            this.listenMediaPlayer(nextProps.mediaPlayer);
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.mediaPlayer.off(dashjs.MediaPlayer.events.METRIC_CHANGED, this.handleMetricChanged);
            this.mediaPlayer = null;
        }
    }

    handleMetricChanged(change) {
        let now = Date.now();
        if (this.state.lastUpdate === null || now - this.state.lastUpdate > 2000) {
            this.setState({lastUpdate:now});
            this.forceUpdate();
        }
    }

    listenMediaPlayer(mediaPlayer) {
        if (mediaPlayer) {
            mediaPlayer.on(dashjs.MediaPlayer.events.METRIC_CHANGED, this.handleMetricChanged);
        }
    }

    render() {
        const { mediaPlayer } = this.props;

        let videoBufferLevel = [],audioBufferLevel = [],videoSchedulingInfo = [],audioSchedulingInfo = [], videoHttpList = [], audioHttpList = [];

        if (mediaPlayer) {
            let minTime = null, maxTime = null;
            const videoMetrics = mediaPlayer.getMetricsFor("video");
            const audioMetrics = mediaPlayer.getMetricsFor("audio");
            if (videoMetrics !== null) {
                if (videoMetrics.BufferLevel) {
                    videoBufferLevel=videoMetrics.BufferLevel;
                    if (videoBufferLevel.length > 0) {
                        minTime = minTime ? Math.min(minTime,videoBufferLevel[0].t.getTime()) : videoBufferLevel[0].t.getTime();
                        maxTime = maxTime ? Math.max(maxTime,videoBufferLevel[videoBufferLevel.length-1].t.getTime()) : videoBufferLevel[videoBufferLevel.length-1].t.getTime();
                    }
                }
                if (videoMetrics.HttpList) {
                    videoHttpList=videoMetrics.HttpList
                        .map(x => Object.assign({bytes:x.range == null ? 0 : x.range.split('-').reduce((startByte,endByte) => endByte - startByte)},x));
                    if (videoHttpList.length > 0) {
                        minTime = minTime ? Math.min(minTime,videoHttpList[0].trequest.getTime()) : videoHttpList[0].trequest.getTime();
                        maxTime = maxTime ? Math.max(maxTime,videoHttpList[videoHttpList.length-1].trequest.getTime()) : videoHttpList[videoHttpList.length-1].trequest.getTime();
                    }
                }
                if (videoMetrics.SchedulingInfo) {
                    videoSchedulingInfo=videoMetrics.SchedulingInfo
                        .filter(x => x.state==="executed" && ! isNaN(x.startTime))
                        .map(x => Object.assign({bytes : x.range == null ? 0 : x.range.split('-').reduce((startByte,endByte) => endByte - startByte)},x));
                    if (videoSchedulingInfo.length > 0) {
                        minTime = minTime ? Math.min(minTime,videoSchedulingInfo[0].t.getTime()) : videoSchedulingInfo[0].t.getTime();
                        maxTime = maxTime ? Math.max(maxTime,videoSchedulingInfo[videoSchedulingInfo.length-1].t.getTime()) : videoSchedulingInfo[videoSchedulingInfo.length-1].t.getTime();
                    }
                }
            }
            if (audioMetrics !== null) {
                if (audioMetrics.BufferLevel) {
                    audioBufferLevel=audioMetrics.BufferLevel;
                    if (audioBufferLevel.length > 0) {
                        minTime = minTime ? Math.min(minTime,audioBufferLevel[0].t.getTime()) : audioBufferLevel[0].t.getTime();
                        maxTime = maxTime ? Math.max(maxTime,audioBufferLevel[audioBufferLevel.length-1].t.getTime()) : audioBufferLevel[audioBufferLevel.length-1].t.getTime();
                    }
                }
                if (audioMetrics.HttpList) {
                    audioHttpList=audioMetrics.HttpList
                        .map(x => Object.assign({bytes:x.range == null ? 0 : x.range.split('-').reduce((startByte,endByte) => endByte - startByte)}, x));
                    if (audioHttpList.length > 0) {
                        minTime = minTime ? Math.min(minTime,audioHttpList[0].trequest.getTime()) : audioHttpList[0].trequest.getTime()
                        maxTime = maxTime ? Math.max(maxTime,audioHttpList[audioHttpList.length-1].trequest.getTime()) : audioHttpList[audioHttpList.length-1].trequest.getTime()
                    }
                }
                if (audioMetrics.SchedulingInfo) {
                    audioSchedulingInfo=audioMetrics.SchedulingInfo
                        .filter(x => x.state==="executed" && ! isNaN(x.startTime))
                        .map(x => Object.assign({bytes:x.range == null ? 0 : x.range.split('-').reduce((startByte,endByte) => endByte - startByte)}, x));
                    if (audioSchedulingInfo.length > 0) {
                        minTime = minTime ? Math.min(minTime,audioSchedulingInfo[0].t.getTime()) : audioSchedulingInfo[0].t.getTime();
                        maxTime = maxTime ? Math.max(maxTime,audioSchedulingInfo[audioSchedulingInfo.length-1].t.getTime()) : audioSchedulingInfo[audioSchedulingInfo.length-1].t.getTime();
                    }
                }
            }

            if (minTime && maxTime) {
                const xAxis =
                    <VictoryAxis
                        dependentAxis={false}
                        tickValues={Array.from({length: 10}, (v, k) => k*Math.max((Math.round((maxTime-minTime) / 10000) * 1000),1000) + minTime)}
                        tickFormat={(x) => (x-minTime) / 1000}
                        style={{
                            axis: {stroke: "#756f6a"},
                            ticks: {stroke: "grey"},
                            tickLabels: {fontSize: 8, padding: 0}
                        }}
                    />;
                return (
                     <Tabs defaultActiveKey={2} animation={false} id="dash-timeseries-tabs">
                         <Tab eventKey={1} title="Network">
                            { (videoBufferLevel.length > 0 || audioBufferLevel.length > 0) &&
                                <NetworkTimeSeries VideoTimeSerie={videoBufferLevel} AudioTimeSerie={audioBufferLevel} x="t" y="level" yAxisLabel="Buffer level (s)" yAxisTickFormat={(tick) => tick / 1000} xAxis={xAxis}/>
                            }
                            { (videoHttpList.length > 0 || audioHttpList.length > 0) &&
                                <div>
                                    <NetworkTimeSeries VideoTimeSerie={videoHttpList} AudioTimeSerie={audioHttpList} x="trequest" y="interval" yAxisLabel="Latency (s)" yAxisTickFormat={(tick) => tick / 1000} xAxis={xAxis}/>
                                    <NetworkTimeSeries VideoTimeSerie={videoHttpList} AudioTimeSerie={audioHttpList} x="trequest" y={x => x.bytes * 8 / x.interval} yAxisLabel="Download (kbps)" xAxis={xAxis} interpolation="bundle"/>
                                </div>
                            }
                            { (videoSchedulingInfo.length > 0 || audioSchedulingInfo.length > 0) &&
                                    <NetworkTimeSeries VideoTimeSerie={videoSchedulingInfo} AudioTimeSerie={audioSchedulingInfo} x="t" y="quality" yAxisLabel="QualityIdx" xAxis={xAxis} interpolation="stepAfter"/>
                            }
                        </Tab>
                         <Tab eventKey={2} title="Presentation">
                            { (videoSchedulingInfo.length > 0 || audioSchedulingInfo.length > 0) &&
                                    this.renderMediaSegmentSizeBarChart(videoSchedulingInfo, audioSchedulingInfo)
                            }
                        </Tab>
                    </Tabs>
                );
            }
        }
        return (
            <div/>
        );
    }

    renderMediaSegmentSizeBarChart(videoSchedulingInfo, audioSchedulingInfo) {
        return (
            <div>
                { videoSchedulingInfo.length &&
                    <VictoryChart height={ 100 } padding={{top: 5, bottom: 20, left: 20, right:5}}>
                        <VictoryAxis
                            dependentAxis={false}
                            style={{
                                axis: {stroke: "#756f6a"},
                                ticks: {stroke: "grey"},
                                tickLabels: {fontSize: 8, padding: 0}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis={true}
                            tickFormat={x => Math.round(x/1000)}
                            label="video chunk (KB)"
                            style={{
                                axis: {stroke: "#756f6a"},
                                axisLabel: {fontSize: 8, padding: 12},
                                grid: {stroke: "grey"},
                                ticks: {stroke: "grey"},
                                tickLabels: {fontSize: 8, padding: 0},
                            }}
                        />
                        <VictoryBar
                            data={videoSchedulingInfo}
                            x="startTime"
                            y="bytes"
                            style= {{
                                data: {fill: x=> Colors.get(x.quality)}
                            }}
                            />
                    </VictoryChart>
                }
                { audioSchedulingInfo.length &&
                    <VictoryChart height={ 100 } padding={{top: 5, bottom: 20, left: 20, right:5}}>
                        <VictoryAxis
                            dependentAxis={false}
                            style={{
                                axis: {stroke: "#756f6a"},
                                ticks: {stroke: "grey"},
                                tickLabels: {fontSize: 8, padding: 0}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis={true}
                            tickFormat={x => Math.round(x/1000)}
                            label="audio chunk (KB)"
                            style={{
                                axis: {stroke: "#756f6a"},
                                axisLabel: {fontSize: 8, padding: 12},
                                grid: {stroke: "grey"},
                                ticks: {stroke: "grey"},
                                tickLabels: {fontSize: 8, padding: 0},
                            }}
                        />
                        <VictoryBar
                            data={audioSchedulingInfo}
                            x="startTime"
                            y="bytes"
                            style= {{
                                data: {fill: x => Colors.get(x.quality)}
                            }}
                            />
                    </VictoryChart>
                }
            </div>
        )
    }
};

DashTimeSeries.propTypes = {
    mediaPlayer: PropTypes.object
};