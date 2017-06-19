
// http://cdn.dashjs.org/latest/jsdoc/MediaPlayerEvents.html

import React from 'react'
import PropTypes from 'prop-types'
import DropdownPanel from '../../utils/DropdownPanel.js'


export default class DashStream extends React.Component {

    getStreamInfoFor = (mediaPlayer, type) => {
        return {
            autoSwitchQuality: mediaPlayer.getAutoSwitchQualityFor(type),
            bitrateList: mediaPlayer.getBitrateInfoListFor(type),
            bufferLength: mediaPlayer.getBufferLength(type),
            initialBitrate: mediaPlayer.getInitialBitrateFor(type),
            initialRepresentationRatio: mediaPlayer.getInitialRepresentationRatioFor(type),
            maxAllowedBitrate: mediaPlayer.getMaxAllowedBitrateFor(type),
            maxAllowedRepresentationRatio: mediaPlayer.getMaxAllowedRepresentationRatioFor(type),
            trackSwitchMode: mediaPlayer.getTrackSwitchModeFor(type),
        }
    }

    render() {
        const { mediaPlayer } = this.props
        return (
            <DropdownPanel title={"Dash Stream"} data={{
                source: mediaPlayer.getSource(),
                duration: mediaPlayer.duration(),
                selectionModeForInitialTrack: mediaPlayer.getSelectionModeForInitialTrack(),
                fastSwitchEnabled: mediaPlayer.getFastSwitchEnabled(),
                video: this.getStreamInfoFor(mediaPlayer, 'video'),
                audio: this.getStreamInfoFor(mediaPlayer, 'audio'),
                text: mediaPlayer.getTracksFor("text")
            }} />
        )
    }
}

DashStream.propTypes = {
    mediaPlayer: PropTypes.object.isRequired
};
