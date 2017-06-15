import React from 'react'
import PropTypes from 'prop-types'
import DashStream from './DashStream.js'
import DashTrack from './DashTrack.js'
import DashMetrics from './DashMetrics.js'

export default class Info extends React.Component {

    render() {
        const { player } = this.props
        return (
            <div>
                dashjs <code> { player.dash.mediaPlayer.getVersion() } </code>
                <DashStream mediaPlayer={ player.dash.mediaPlayer } />
                <DashTrack type='video' mediaPlayer={ player.dash.mediaPlayer } />
                <DashTrack type='audio' mediaPlayer={ player.dash.mediaPlayer } />
                <DashMetrics type='video' mediaPlayer={ player.dash.mediaPlayer } />
                <DashMetrics type='audio' mediaPlayer={ player.dash.mediaPlayer } />
            </div>
        )
    }
}

Info.propTypes = {
    player: PropTypes.object.isRequired
};