import React from 'react'
import PropTypes from 'prop-types'
import dashjs from 'dashjs'

import { VictoryLine, VictoryChart } from 'victory'

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
            return (
                <VictoryChart
                    easing="linear"
                    height="200"
                >
                    <VictoryLine
                        interpolation="natural"
                        data={mediaPlayer.getMetricsFor("video").BufferLevel}
                        x="t"
                        y="level"
                        style={{
                            data:{strokeWidth:1}
                        }}
                    />
                </VictoryChart>
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