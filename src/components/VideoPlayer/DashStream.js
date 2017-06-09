
// http://cdn.dashjs.org/latest/jsdoc/MediaPlayerEvents.html

import React from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree'
import DashTrack from './DashTrack.js'
import DashMetrics from './DashMetrics.js'

export default class DashStream extends React.Component {

    getStreamInfoFor = (mediaPlayer,type) => {
        return {
            autoSwitchQuality: mediaPlayer.getAutoSwitchQualityFor(type),
            bitrateList: mediaPlayer.getBitrateInfoListFor(type),
            bufferLength: mediaPlayer.getBufferLength(type),
            initialBitrate : mediaPlayer.getInitialBitrateFor(type),
            initialRepresentationRatio : mediaPlayer.getInitialRepresentationRatioFor(type),
            maxAllowedBitrate : mediaPlayer.getMaxAllowedBitrateFor(type),
            maxAllowedRepresentationRatio : mediaPlayer.getMaxAllowedRepresentationRatioFor(type),
            trackSwitchMode : mediaPlayer.getTrackSwitchModeFor(type),
        }
    }

    render() {
        const { mediaPlayer } = this.props
        return (
            <div>
                <div>
                    <h1>Dash stream</h1>
                    <JSONTree data={ {
                        version: mediaPlayer.getVersion(),
                        source: mediaPlayer.getSource(),
                        duration: mediaPlayer.duration(),
                        selectionModeForInitialTrack: mediaPlayer.getSelectionModeForInitialTrack(),
                        fastSwitchEnabled: mediaPlayer.getFastSwitchEnabled(),
                        video: this.getStreamInfoFor(mediaPlayer,'video'),
                        audio: this.getStreamInfoFor(mediaPlayer,'audio')
                    } } />
                </div>
                <div>
                    <DashTrack type='video' mediaPlayer={ mediaPlayer } />
                </div>
                <div>
                    <DashTrack type='audio' mediaPlayer={ mediaPlayer } />
                </div>
                <div>
                    <DashMetrics type='video' mediaPlayer={ mediaPlayer } />
                </div>
                <div>
                    <DashMetrics type='audio' mediaPlayer={ mediaPlayer } />
                </div>
            </div>
        )
    }
}

DashStream.propTypes = {
    mediaPlayer: PropTypes.object.isRequired
};
