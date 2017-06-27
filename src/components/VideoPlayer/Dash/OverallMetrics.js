import React from 'react'
import PropTypes from 'prop-types'
import dashjs from 'dashjs'

import { VictoryPie } from 'victory'

export default class DashOverallMetrics extends React.Component {
    constructor(...args) {
        super(...args)
        this.state = {
            lastUpdate: null
        }
        this.mediaPlayer = null
    }

    componentDidMount() {
        this.mediaPlayer = this.props.mediaPlayer
        this.observeMediaPlayer()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mediaPlayer !== nextProps.mediaPlayer) {
            this.mediaPlayer = nextProps.mediaPlayer
            this.observeMediaPlayer()
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.mediaPlayer.off(dashjs.MediaPlayer.events.METRIC_CHANGED, null)
            this.mediaPlayer = null
        }
    }

    observeMediaPlayer() {
        if (this.mediaPlayer) {
            this.mediaPlayer.on(dashjs.MediaPlayer.events.METRIC_CHANGED,
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

    percentageQualityIdxForTrack(type) {
        let qualityIndex = new Map()
        if (this.mediaPlayer) {
            let metrics = this.mediaPlayer.getMetricsFor(type)
            if (metrics !== null) {
                metrics.SchedulingInfo.filter(x => x.state==="executed" && !isNaN(x.quality) && !isNaN(x.duration)).forEach(x => {
                    let index = type === "video"
                                ? `${this.mediaPlayer.getTracksFor("video")[0].bitrateList[x.quality].width}x${this.mediaPlayer.getTracksFor("video")[0].bitrateList[x.quality].height}`
                                :`${Math.round(this.mediaPlayer.getTracksFor("audio")[0].bitrateList[x.quality].bandwidth / 1000)}kbps`
                    if (! qualityIndex.has(index)) {
                        qualityIndex.set(index,x.duration)
                    } else {
                        qualityIndex.set(index,qualityIndex.get(index)+x.duration)
                    }
                })
            }
        }
        return qualityIndex
    }

    render() {
        let renderComponents = [], type
        if (this.mediaPlayer) {
            for (type of ["video","audio"]) {
                let qualityIndex = this.percentageQualityIdxForTrack(type)
                if (qualityIndex.size >0) {
                    renderComponents.push(
                        <VictoryPie
                            data={Array.from(qualityIndex)}
                            x={0}
                            y={1}
                            style={{
                                labels: { fontSize: 36 }
                            }}
                            key={`${type}QualityIdx`}
                        />
                    )
                }
            }
        }
        return (
            <div>
                {renderComponents}
            </div>
        )
    }
}

DashOverallMetrics.propTypes = {
    mediaPlayer: PropTypes.object
}