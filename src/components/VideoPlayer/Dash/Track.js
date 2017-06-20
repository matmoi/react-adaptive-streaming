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
            if (qualityIndex) {
                return (
                    <DropdownPanel title={`${type} track`} data={{
                            qualityIndex: qualityIndex,
                            bandwidth: track.bitrateList[qualityIndex].bandwidth,
                            width: track.bitrateList[qualityIndex].width,
                            height: track.bitrateList[qualityIndex].height,
                            codec: track.codec,
                            contentProtection: track.contentProtection,
                            mimeType: track.mimeType
                        }}
                    />
                )
            }
        }
        return (
            <DropdownPanel title={`${type} track`} data={null}/>
        )
    }
}

DashTrack.propTypes = {
    mediaPlayer: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['audio', 'video', 'text'])
};

DashTrack.defaultProps = {
    type: 'audio'
}