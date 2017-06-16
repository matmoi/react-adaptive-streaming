import React from 'react'
import PropTypes from 'prop-types'
import DashStream from './Stream.js'
import DashTrack from './Track.js'
import DashMetrics from './Metrics.js'

export default class DashInfo extends React.Component {

    render() {
        const { mediaPlayer } = this.props
        return (
            <div>
                dashjs <code> { mediaPlayer.getVersion() } </code>
                <DashStream mediaPlayer={ mediaPlayer } />
                <DashTrack type='video' mediaPlayer={ mediaPlayer } />
                <DashTrack type='audio' mediaPlayer={ mediaPlayer } />
                <DashMetrics type='video' mediaPlayer={ mediaPlayer } />
                <DashMetrics type='audio' mediaPlayer={ mediaPlayer } />
            </div>
        )
    }
}

DashInfo.propTypes = {
    mediaPlayer: PropTypes.object.isRequired
};