import React from 'react'
import PropTypes from 'prop-types'
import dashjs from 'dashjs'

import { VictoryPie } from 'victory'
import { Button, ButtonGroup } from 'react-bootstrap'

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
                        this.setState({ lastUpdate: now })
                        this.forceUpdate()
                    }
                }.bind(this)
            )
        }
    }

    percentageQualityIdxForTrack(type) {
        let qualityIndex = Object.assign({})
        if (this.mediaPlayer) {
            let metrics = this.mediaPlayer.getMetricsFor(type)
            if (metrics !== null) {
                metrics.SchedulingInfo.filter(x => x.state === "executed" && !isNaN(x.quality) && !isNaN(x.duration)).forEach(x => {
                    if (! (x.quality in qualityIndex)) {
                        let label = type === "video"
                                    ? `${this.mediaPlayer.getTracksFor("video")[0].bitrateList[x.quality].width}x${this.mediaPlayer.getTracksFor("video")[0].bitrateList[x.quality].height}`
                                    : `${Math.round(this.mediaPlayer.getTracksFor("audio")[0].bitrateList[x.quality].bandwidth / 1000)}kbps`
                        qualityIndex[x.quality] = 
                        {duration:x.duration,label:label,index:x.quality,card:1}
                    } else {
                        qualityIndex[x.quality].duration += x.duration
                        qualityIndex[x.quality].card += 1
                    }
                })
            }
        }
        return Object.values(qualityIndex)
    }

    render() {
        let renderComponents = { video: [], audio: [] }, type
        if (this.mediaPlayer) {
            for (type of ["video", "audio"]) {
                let qualityIndex = this.percentageQualityIdxForTrack(type)
                let currentTrackIndex = this.mediaPlayer.getQualityFor(type)
                if (qualityIndex.length > 0) {
                    renderComponents[type].push(
                        <VictoryPie width={400} height={150}
                            data={qualityIndex}
                            x="index"
                            y="duration"
                            style={{
                                data: { stroke : "yellow",
                                        strokeWidth : x=>x.index === currentTrackIndex ? 4 : 0},
                                labels: { fontSize: 18 }
                            }}
                            key={`${type}QualityIdx`}
                            padding={{top:30,left:0,right:0,bottom:30}}
                        />
                    )
                }
            }
        }
        return (
            <div>
                <ButtonGroup vertical block key={`VideoQualityIdxHeader`}>
                    <Button disabled bsStyle="primary">{`video metrics`}</Button>
                </ButtonGroup>
                {renderComponents.video}
                <ButtonGroup vertical block key={`AudioQualityIdxHeader`}>
                    <Button disabled bsStyle="primary">{`audio metrics`}</Button>
                </ButtonGroup>
                {renderComponents.audio}
            </div>
        )
    }
}

DashOverallMetrics.propTypes = {
    mediaPlayer: PropTypes.object
}