
// http://cdn.dashjs.org/latest/jsdoc/MediaPlayerEvents.html

import React from 'react'
import PropTypes from 'prop-types'
import JSONTree from 'react-json-tree'
import DashTrack from './DashTrack.js'
import DashMetrics from './DashMetrics.js'
import { Panel, Button } from 'react-bootstrap'

export default class DashStream extends React.Component {

    constructor(...args) {
        super(...args)
        this.state = {
            open: true
        }
    }

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
                    <Button onClick={ ()=> this.setState({ open: !this.state.open })} bsStyle="primary">Dash Stream</Button>
                    <Panel collapsible expanded={this.state.open} bsClass="custom-panel">
                        <JSONTree hideRoot="true" data={ {
                        version: mediaPlayer.getVersion(),
                        source: mediaPlayer.getSource(),
                        duration: mediaPlayer.duration(),
                        selectionModeForInitialTrack: mediaPlayer.getSelectionModeForInitialTrack(),
                        fastSwitchEnabled: mediaPlayer.getFastSwitchEnabled(),
                        video: this.getStreamInfoFor(mediaPlayer,'video'),
                        audio: this.getStreamInfoFor(mediaPlayer,'audio')
                    } } />
                    </Panel>
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
