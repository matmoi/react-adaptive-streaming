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

        let videoBufferLevel = [],audioBufferLevel = [],videoRequests = [],audioRequests = [], videoSchedulingInfo = [], audioSchedulingInfo = []

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
                if (videoMetrics.RequestsQueue && videoMetrics.RequestsQueue.executedRequests) {
                    videoRequests=videoMetrics.RequestsQueue.executedRequests.filter(x=>x.requestStartDate !== null)
                    if (videoRequests.length > 0) {
                        minTime = minTime ? Math.min(minTime,videoRequests[0].requestStartDate.getTime()) : videoRequests[0].requestStartDate.getTime()
                        maxTime = maxTime ? Math.max(maxTime,videoRequests[videoRequests.length-1].requestStartDate.getTime()) : videoRequests[videoRequests.length-1].requestStartDate.getTime()
                    }
                }
                if (videoMetrics.SchedulingInfo) {
                    videoSchedulingInfo=videoMetrics.SchedulingInfo
                    if (videoSchedulingInfo.length > 0) {
                        minTime = minTime ? Math.min(minTime,videoSchedulingInfo[0].t.getTime()) : videoSchedulingInfo[0].t.getTime()
                        maxTime = maxTime ? Math.max(maxTime,videoSchedulingInfo[videoSchedulingInfo.length-1].t.getTime()) : videoSchedulingInfo[videoSchedulingInfo.length-1].t.getTime()
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
                if (audioMetrics.RequestsQueue && audioMetrics.RequestsQueue.executedRequests) {
                    audioRequests=audioMetrics.RequestsQueue.executedRequests
                    if (audioRequests.length > 0) {
                        minTime = minTime ? Math.min(minTime,audioRequests[0].requestStartDate.getTime()) : audioRequests[0].requestStartDate.getTime()
                        maxTime = maxTime ? Math.max(maxTime,audioRequests[audioRequests.length-1].requestStartDate.getTime()) : audioRequests[audioRequests.length-1].requestStartDate.getTime()
                    }
                }
                if (audioMetrics.SchedulingInfo) {
                    audioSchedulingInfo=audioMetrics.SchedulingInfo
                    if (audioSchedulingInfo.length > 0) {
                        minTime = minTime ? Math.min(minTime,audioSchedulingInfo[0].t.getTime()) : audioSchedulingInfo[0].t.getTime()
                        maxTime = maxTime ? Math.max(maxTime,audioSchedulingInfo[audioSchedulingInfo.length-1].t.getTime()) : audioSchedulingInfo[audioSchedulingInfo.length-1].t.getTime()
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
                    />
                return (
                    <div>
                        { (videoBufferLevel.length > 0 || audioBufferLevel.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoBufferLevel} AudioTimeSerie={audioBufferLevel} x="t" y="level" yAxisLabel="Buffer level (s)" yAxisTickFormat={(tick) => tick / 1000} xAxis={xAxis}/>
                        }
                        { (videoRequests.length > 0 || audioRequests.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoRequests} AudioTimeSerie={audioRequests} x="requestStartDate" y={(req) => (req.requestEndDate-req.requestStartDate)/1000} yAxisLabel="Latency (s)" xAxis={xAxis}/>
                        }
                        { (videoRequests.length > 0 || audioRequests.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoRequests} AudioTimeSerie={audioRequests} x="requestStartDate" y={(req) => (req.bytesTotal * 8 / (req.requestEndDate-req.requestStartDate))} yAxisLabel="Download (kbps)" xAxis={xAxis} interpolation="bundle"/>
                        }
                        { (videoSchedulingInfo.length > 0 || audioSchedulingInfo.length > 0) &&
                            <MediaTimeSeries VideoTimeSerie={videoSchedulingInfo.filter((x) => x.state==="executed")} AudioTimeSerie={audioSchedulingInfo.filter((x) => x.state==="executed")} x="t" y="quality" yAxisLabel="QualityIdx" xAxis={xAxis} interpolation="stepAfter"/>
                        }
                    </div>
                )
            }
        }
        return (
            <div/>
        )
    }
}

DashTimeSeries.propTypes = {
    mediaPlayer: PropTypes.object
}