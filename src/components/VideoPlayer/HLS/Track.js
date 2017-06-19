import React from 'react'
import PropTypes from 'prop-types'
import DropdownPanel from '../../utils/DropdownPanel.js'
import Hls from 'hls.js'

export default class HLSTrack extends React.Component {

    componentDidMount() {
        const { mediaPlayer, type } = this.props
        let switchEvent = null
        switch (type) {
            case "audio":
                switchEvent = Hls.Events.AUDIO_TRACK_SWITCHED
                break
            case "subtitle":
                switchEvent = Hls.Events.SUBTITLE_TRACK_SWITCH
                break
            default:
                switchEvent = Hls.Events.LEVEL_SWITCHED
        }
        mediaPlayer.on(switchEvent, function () {
            this.forceUpdate()
        }.bind(this))
    }

    render() {
        const { mediaPlayer, type } = this.props
        let track = null
        if (type === "audio") {
            if (mediaPlayer.audioTrack !== -1) {
                track = mediaPlayer.audioTracks[mediaPlayer.audioTrack]
            }
        }
        else if (type === "subtitle") {
            if (mediaPlayer.subtitleTrack !== -1) {
                track = mediaPlayer.subtitleTracks[mediaPlayer.subtitleTrack]
            }
        }
        else { //video
            if (mediaPlayer.currentLevel !== -1) {
                track = mediaPlayer.levels[mediaPlayer.currentLevel]
            }
        }
        return (
            <div>
                <DropdownPanel title={`Dash ${type} track`} data={
                    track !== null ? {...track} : null} />
            </div>
        )
    }
}

HLSTrack.propTypes = {
    mediaPlayer: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['audio', 'video', 'subtitle'])
};

HLSTrack.defaultProps = {
    type: 'audio'
}