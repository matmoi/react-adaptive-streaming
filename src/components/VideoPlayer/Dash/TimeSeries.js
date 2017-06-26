import React from 'react'
import PropTypes from 'prop-types'
import dashjs from 'dashjs'

import { VictoryLegend, VictoryAxis, VictoryLine, VictoryChart } from 'victory'

class MediaTimeSeries extends React.Component {

    render () {
        const { AudioTimeSerie, VideoTimeSerie, yAxisLabel, yAxisTickFormat, xAxis, x, y, interpolation } = this.props

        return (
            <VictoryChart height={ 100 } padding={{top: 5, bottom: 20, left: 20, right:5}}>
                <VictoryLegend
                    data={[
                        {name: 'video', labels: { fill: "#ff0000" }, symbol: {type:"circle",size:1}},
                        {name: 'audio', labels: { fill: "#ff00ff" }, symbol: {type:"circle",size:1}}
                        ]}
                    style={{
                        labels: { fontSize: 8 }
                    }}
                    colorScale={["#ff0000","#ff00ff"]}
                    symbolSpacer={0}
                    x={0}
                    y={0}
                />
                <VictoryAxis
                    dependentAxis={true}
                    tickFormat={yAxisTickFormat}
                    label={yAxisLabel}
                    style={{
                        axis: {stroke: "#756f6a"},
                        axisLabel: {fontSize: 8, padding: 12},
                        grid: {stroke: "grey"},
                        ticks: {stroke: "grey"},
                        tickLabels: {fontSize: 8, padding: 0}
                    }}
                />
                { xAxis }
                { VideoTimeSerie.length > 0 &&
                    <VictoryLine
                        data={ VideoTimeSerie }
                        x={x}
                        y={y}
                        sortKey="x"
                        scale="time"
                        style={{
                            data:{strokeWidth:1, stroke: "#ff0000"}
                        }}
                        interpolation={interpolation}
                    />
                }
                { AudioTimeSerie.length > 0 &&
                    <VictoryLine
                        data={ AudioTimeSerie }
                        x={x}
                        y={y}
                        sortKey="x"
                        scale="time"
                        style={{
                            data:{strokeWidth:1, stroke: "#ff00ff"}
                        }}
                        interpolation={interpolation}
                    />
                }
            </VictoryChart>
        )
    }
}

MediaTimeSeries.propTypes = {
    AudioTimeSerie: PropTypes.arrayOf(PropTypes.object),
    VideoTimeSerie: PropTypes.arrayOf(PropTypes.object),
    yAxisLabel: PropTypes.string,
    yAxisTickFormat: PropTypes.func,
    xTickValues: PropTypes.element,
    x: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
    y: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
    interpolation: PropTypes.string
}

MediaTimeSeries.defaultProps = {
    AudioTimeSerie: [],
    VideoTimeSerie: [],
    yAxisLabel: "",
    yAxisTickFormat: (t) => t,
    minTime: 0,
    interpolation: "linear"
}

export default class DashTimeSeries extends React.Component {

    constructor(...args) {
        super(...args)
        this.state = {
            lastUpdate: null
        }
    }
    componentDidMount() {
        const { mediaPlayer } = this.props
        this.observeMediaPlayer(mediaPlayer)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mediaPlayer !== nextProps.mediaPlayer) {
            this.observeMediaPlayer(nextProps.mediaPlayer)
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.mediaPlayer.off(dashjs.MediaPlayer.events.METRIC_CHANGED, null)
            this.mediaPlayer = null
        }
    }

    observeMediaPlayer(mediaPlayer) {
        if (mediaPlayer) {
            mediaPlayer.on(dashjs.MediaPlayer.events.METRIC_CHANGED,
                function (change) {
                    let now = Date.now()
                    if (this.state.lastUpdate === null || now - this.state.lastUpdate > 2000) {
                        this.setState({lastUpdate:now})
                        this.forceUpdate()
                    }
                }.bind(this)
            )
        }
    }

    render() {
        const { mediaPlayer } = this.props

        let videoBufferLevel = [],audioBufferLevel = [],videoLatency = [],audioLatency = [],videoRepSwitch = [],audioRepSwitch = []

        if (mediaPlayer) {
            let minTime = null, maxTime = null
            const videoMetrics = mediaPlayer.getMetricsFor("video")
            const audioMetrics = mediaPlayer.getMetricsFor("audio")
            if (videoMetrics !== null) {
                if (videoMetrics.BufferLevel) {
                    videoBufferLevel=videoMetrics.BufferLevel
                    if (videoBufferLevel.length > 0) {
                        minTime = minTime ? Math.min(minTime,videoBufferLevel[0].t.getTime()) : videoBufferLevel[0].t.getTime()
                        maxTime = maxTime ? Math.max(maxTime,videoBufferLevel[videoBufferLevel.length-1].t.getTime()) : videoBufferLevel[videoBufferLevel.length-1].t.getTime()
                    }
                }
                if (videoMetrics.HttpList) {
                    videoLatency=videoMetrics.HttpList
                    if (videoLatency.length > 0) {
                        minTime = minTime ? Math.min(minTime,videoLatency[0].trequest.getTime()) : videoLatency[0].trequest.getTime()
                        maxTime = maxTime ? Math.max(maxTime,videoLatency[videoLatency.length-1].trequest.getTime()) : videoLatency[videoLatency.length-1].trequest.getTime()
                    }
                }
                if (videoMetrics.RepSwitchList) {
                    videoRepSwitch=videoMetrics.RepSwitchList
                    if (videoRepSwitch.length > 0) {
                        minTime = minTime ? Math.min(minTime,videoRepSwitch[0].t.getTime()) : videoRepSwitch[0].t.getTime()
                        maxTime = maxTime ? Math.max(maxTime,videoRepSwitch[videoRepSwitch.length-1].t.getTime()) : videoRepSwitch[videoRepSwitch.length-1].t.getTime()
                    }
                }
            }
            if (audioMetrics !== null) {
                if (audioMetrics.BufferLevel) {
                    audioBufferLevel=audioMetrics.BufferLevel
                    if (audioBufferLevel.length > 0) {
                        minTime = minTime ? Math.min(minTime,audioBufferLevel[0].t.getTime()) : audioBufferLevel[0].t.getTime()
                        maxTime = maxTime ? Math.max(maxTime,audioBufferLevel[audioBufferLevel.length-1].t.getTime()) : audioBufferLevel[audioBufferLevel.length-1].t.getTime()
                    }
                }
                if (audioMetrics.HttpList) {
                    audioLatency=audioMetrics.HttpList
                    if (audioLatency.length > 0) {
                        minTime = minTime ? Math.min(minTime,audioLatency[0].trequest.getTime()) : audioLatency[0].trequest.getTime()
                        maxTime = maxTime ? Math.max(maxTime,audioLatency[audioLatency.length-1].trequest.getTime()) : audioLatency[audioLatency.length-1].trequest.getTime()
                    }
                }
                if (audioMetrics.RepSwitchList) {
                    audioRepSwitch=audioMetrics.RepSwitchList
                    if (audioRepSwitch.length > 0) {
                        minTime = minTime ? Math.min(minTime,audioRepSwitch[0].t.getTime()) : audioRepSwitch[0].t.getTime()
                        maxTime = maxTime ? Math.max(maxTime,audioRepSwitch[audioRepSwitch.length-1].t.getTime()) : audioRepSwitch[audioRepSwitch.length-1].t.getTime()
                    }
                }
            }

            if (minTime && maxTime) {
                const xAxis =
                    <VictoryAxis
                        dependentAxis={false}
                        tickValues={Array.from({length: Math.max((maxTime-minTime) / 6000,6)}, (v, k) => k*6000 + minTime)}
                        tickFormat={(x) => (x-minTime) / 1000}
                        style={{
                            axis: {stroke: "#756f6a"},
                            ticks: {stroke: "grey"},
                            tickLabels: {fontSize: 8, padding: 0}
                        }}
                    />
                return (
                    <div>
                        { (videoBufferLevel.length > 0 || audioBufferLevel.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoBufferLevel} AudioTimeSerie={audioBufferLevel} x="t" y="level" yAxisLabel="Buffer level (s)" yAxisTickFormat={(tick) => tick / 1000} xAxis={xAxis}/>
                        }
                        { (videoLatency.length > 0 || audioLatency.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoLatency} AudioTimeSerie={audioLatency} x="trequest" y="interval" yAxisLabel="Latency (s)" yAxisTickFormat={(tick) => tick / 1000} xAxis={xAxis}/>
                        }
                        { (videoLatency.length > 0 || audioLatency.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoLatency} AudioTimeSerie={audioLatency} x="trequest" y={(req) => (req.range === null ? 0 : (req.range.split('-').reduce((startByte,endByte) => (endByte - startByte)*0.008)) / req.interval)} yAxisLabel="Download (kbps)" xAxis={xAxis} interpolation="bundle"/>
                        }
                        { (videoRepSwitch.length > 0 || audioRepSwitch.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoRepSwitch} AudioTimeSerie={audioRepSwitch} x="t" y="to" yAxisLabel="RepSwitch" xAxis={xAxis} interpolation="step"/>
                        }
                    </div>
                )
            }
        }
        return (
            <div></div>
        )
    }
}

DashTimeSeries.propTypes = {
    mediaPlayer: PropTypes.object
}