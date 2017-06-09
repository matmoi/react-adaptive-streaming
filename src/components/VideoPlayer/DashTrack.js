
import React from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree'
import dashjs from 'dashjs'

export default class DashTrack extends React.Component {

    componentDidMount(){
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
        const qualityIndex = mediaPlayer.getQualityFor(type)
        if (track && qualityIndex !== null) {
            return (
                <div>
                    <h2>Dash { type } track</h2>
                    <JSONTree data={ {
                        qualityIndex: qualityIndex,
                        bandwidth: track.bitrateList[qualityIndex].bandwidth,
                        width: track.bitrateList[qualityIndex].width,
                        height: track.bitrateList[qualityIndex].height,
                        codec: track.codec,
                        contentProtection: track.contentProtection,
                        mimeType: track.mimeType
                    } } />
                </div>
            )
        } else {
            return (<div><h2>Dash {type} track</h2></div>)
        }
    }
}

DashTrack.propTypes = {
    mediaPlayer: PropTypes.object.isRequired,
    type: PropTypes.string
};

DashTrack.defaultProps = {
    type: 'audio'
}