import React from 'react'
import PropTypes from 'prop-types'
import DashStream from './Stream.js'
import DashTrack from './Track.js'

export default class DashInfo extends React.Component {

    render() {
        const { mediaPlayer } = this.props
        if (mediaPlayer) {
            return (
                <div>
                    dashjs <code> { mediaPlayer.getVersion() } </code>
                    <DashStream mediaPlayer={ mediaPlayer } />
                    <DashTrack type='video' mediaPlayer={ mediaPlayer } />
                    <DashTrack type='audio' mediaPlayer={ mediaPlayer } />
                    <DashTrack type='text' mediaPlayer={ mediaPlayer } />
                </div>
            )
        }
        else {
            return (<div />)
        }
    }
}

DashInfo.propTypes = {
    mediaPlayer: PropTypes.object
};