import React from 'react'
import PropTypes from 'prop-types'
import dashjs from 'dashjs'

import { VictoryLegend, VictoryAxis, VictoryLine, VictoryChart } from 'victory'

class MediaTimeSeries extends React.Component {

    render () {
        const { AudioTimeSerie, VideoTimeSerie, yAxisLabel, yAxisTickFormat, x, y , refTime } = this.props
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
                    tickFormat={(tick) => (VideoTimeSerie ? VideoTimeSerie.length > 30 : false || AudioTimeSerie ? AudioTimeSerie.length > 30 : false) ? Math.trunc(((tick - refTime) / 1000)) : ((tick - refTime) / 1000)}
                    style={{
                        axis: {stroke: "#756f6a"},
                        ticks: {stroke: "grey"},
                        tickLabels: {fontSize: 8, padding: 0}
                    }}
                />

                { legend }
                <VictoryLine
                    data={ VideoTimeSerie }
                    x={x}
                    y={y}
                    sortKey="x"
                    scale="time"
                    style={{
                        data:{strokeWidth:1, stroke: "#ff0000"}
                    }}
                />
                <VictoryLine
                    data={ AudioTimeSerie }
                    x={x}
                    y={y}
                    sortKey="x"
                    scale="time"
                    style={{
                        data:{strokeWidth:1, stroke: "#ff00ff"}
                    }}
                />
            </VictoryChart>
        )
    }
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
            this.mediaPlayer.off(dashjs.MediaPlayer.events.METRIC_CHANGED, ()=>{})
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
        if (mediaPlayer) {
            const videoBufferLevel = mediaPlayer.getMetricsFor("video").BufferLevel
            const audioBufferLevel = mediaPlayer.getMetricsFor("audio").BufferLevel
            const videoLatency = mediaPlayer.getMetricsFor("video").HttpList
            const audioLatency = mediaPlayer.getMetricsFor("audio").HttpList

            const refTime = Math.min(videoLatency[0].trequest,audioLatency[0].trequest)

            return (
                <div>
                    <MediaTimeSeries VideoTimeSerie={videoBufferLevel} AudioTimeSerie={audioBufferLevel} x="t" y="level" yAxisLabel="Buffer level (s)" yAxisTickFormat={(tick) => tick / 1000} refTime={refTime}/>
                    <MediaTimeSeries VideoTimeSerie={videoLatency} AudioTimeSerie={audioLatency} x="trequest" y="interval" yAxisLabel="Latency (s)" yAxisTickFormat={(tick) => tick / 1000} refTime={refTime}/>
                </div>
            )
        }
        return (
            <div></div>
        )
    }
}

DashTimeSeries.propTypes = {
    mediaPlayer: PropTypes.object,
}