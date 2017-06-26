import React from 'react'
import PropTypes from 'prop-types'
import dashjs from 'dashjs'

import { VictoryLegend, VictoryAxis, VictoryLine, VictoryChart } from 'victory'

class MediaTimeSeries extends React.Component {

    render () {
        const { AudioTimeSerie, VideoTimeSerie, yAxisLabel, yAxisTickFormat, x, y , refTime, interpolation } = this.props
        const legend =
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


        return (
            <VictoryChart height={ 100 } padding={{top: 5, bottom: 20, left: 20}}>
                { legend }

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

                <VictoryAxis
                    dependentAxis={false}
                    tickFormat={(tick) => (VideoTimeSerie.length > 30 || AudioTimeSerie.length > 30) ? Math.trunc(((tick - refTime) / 1000)) : ((tick - refTime) / 1000)}
                    style={{
                        axis: {stroke: "#756f6a"},
                        ticks: {stroke: "grey"},
                        tickLabels: {fontSize: 8, padding: 0}
                    }}
                />

                { legend }
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
    x: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
    y: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
    refTime: PropTypes.number,
    interpolation: PropTypes.string
}

MediaTimeSeries.defaultProps = {
    AudioTimeSerie: [],
    VideoTimeSerie: [],
    yAxisLabel: "",
    yAxisTickFormat: (t) => t,
    refTime: 0,
    interpolation: "linear"
}

export default class DashTimeSeries extends React.Component {

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
                    this.forceUpdate()
                }.bind(this)
            )
        }
    }

    render() {
        const { mediaPlayer } = this.props

        let videoBufferLevel = [],audioBufferLevel = [],videoLatency = [],audioLatency = [],videoRepSwitch = [],audioRepSwitch = []

        if (mediaPlayer) {
            let refTime = undefined
            const videoMetrics = mediaPlayer.getMetricsFor("video")
            const audioMetrics = mediaPlayer.getMetricsFor("audio")
            if (videoMetrics !== null) {
                if (videoMetrics.BufferLevel) {
                    videoBufferLevel=videoMetrics.BufferLevel
                    if (videoBufferLevel.length > 0) {
                        refTime = refTime ? Math.min(refTime,videoBufferLevel[0].t) : videoBufferLevel[0].t.getTime()
                    }
                }
                if (videoMetrics.HttpList) {
                    videoLatency=videoMetrics.HttpList
                    if (videoLatency.length > 0) {
                        refTime = refTime ? Math.min(refTime,videoLatency[0].trequest) : videoLatency[0].trequest.getTime()
                    }
                }
                if (videoMetrics.RepSwitchList) {
                    videoRepSwitch=videoMetrics.RepSwitchList
                    if (videoRepSwitch.length > 0) {
                        refTime = refTime ? Math.min(refTime,videoRepSwitch[0].t) : videoRepSwitch[0].t.getTime()
                    }
                }
            }
            if (audioMetrics !== null) {
                if (audioMetrics.BufferLevel) {
                    audioBufferLevel=audioMetrics.BufferLevel
                    if (audioBufferLevel.length > 0) {
                        refTime = refTime ? Math.min(refTime,audioBufferLevel[0].t) : audioBufferLevel[0].t.getTime()
                    }
                }
                if (audioMetrics.HttpList) {
                    audioLatency=audioMetrics.HttpList
                    if (audioLatency.length > 0) {
                        refTime = refTime ? Math.min(refTime,audioLatency[0].trequest) : audioLatency[0].trequest.getTime()
                    }
                }
                if (audioMetrics.RepSwitchList) {
                    audioRepSwitch=audioMetrics.RepSwitchList
                    if (audioRepSwitch.length > 0) {
                        refTime = refTime ? Math.min(refTime,audioRepSwitch[0].t) : audioRepSwitch[0].t.getTime()
                    }
                }
            }

            if (refTime) {
                return (
                    <div>
                        { (videoBufferLevel.length > 0 || audioBufferLevel.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoBufferLevel} AudioTimeSerie={audioBufferLevel} x="t" y="level" yAxisLabel="Buffer level (s)" yAxisTickFormat={(tick) => tick / 1000} refTime={refTime}/>
                        }
                        { (videoLatency.length > 0 || audioLatency.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoLatency} AudioTimeSerie={audioLatency} x="trequest" y="interval" yAxisLabel="Latency (s)" yAxisTickFormat={(tick) => tick / 1000} refTime={refTime}/>
                        }
                        { (videoLatency.length > 0 || audioLatency.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoLatency} AudioTimeSerie={audioLatency} x="trequest" y={(req) => (req.range === null ? 0 : (req.range.split('-').reduce((startByte,endByte) => (endByte - startByte)*8)) / req.interval)} yAxisLabel="Download (kbps)" refTime={refTime} interpolation="bundle"/>
                        }
                        { (videoRepSwitch.length > 0 || audioRepSwitch.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoRepSwitch} AudioTimeSerie={audioRepSwitch} x="t" y="to" yAxisLabel="RepSwitch" refTime={refTime} interpolation="stepAfter"/>
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