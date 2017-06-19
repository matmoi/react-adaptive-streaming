import React from 'react'
import PropTypes from 'prop-types'
import DropdownPanel from '../../utils/DropdownPanel.js'


export default class HLSStream extends React.Component {

    render() {
        const { mediaPlayer } = this.props
        return (
            <DropdownPanel title={"HLS Stream"} data={{
                url: mediaPlayer.url,
                video: mediaPlayer.levels,
                audio: mediaPlayer.audioTracks,
                subtitles: mediaPlayer.subtitleTracks
            }} />
        )
    }
}

HLSStream.propTypes = {
    mediaPlayer: PropTypes.object.isRequired
};
