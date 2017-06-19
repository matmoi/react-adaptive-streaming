import React from 'react'
import PropTypes from 'prop-types'
import DropdownPanel from '../../utils/DropdownPanel.js'
import dashjs from 'dashjs'

export default class DashTrack extends React.Component {

    componentDidMount() {
        const { mediaPlayer, type } = this.props
        mediaPlayer.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, function (change) {
            if (change.mediaType === type) {
                this.forceUpdate()
            }
        }.bind(this))
    }

    render() {
        const { mediaPlayer, type } = this.props
        const track = mediaPlayer.getCurrentTrackFor(type)
        if (track !== null) {
            const qualityIndex = mediaPlayer.getQualityFor(type)
            if (qualityIndex !== null) {
                return (
                    <div>
                        <DropdownPanel title={`Dash ${type} track`} data={{
                                qualityIndex: qualityIndex,
                                bandwidth: track.bitrateList[qualityIndex].bandwidth,
                                width: track.bitrateList[qualityIndex].width,
                                height: track.bitrateList[qualityIndex].height,
                                codec: track.codec,
                                contentProtection: track.contentProtection,
                                mimeType: track.mimeType
                        }} />
                    </div>
                )
            }
        }
        return (<div>{`Loading dash ${type} track`}</div>)
    }
}

DashTrack.propTypes = {
    mediaPlayer: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['audio', 'video', 'subtitle'])
};

DashTrack.defaultProps = {
    type: 'audio'
}