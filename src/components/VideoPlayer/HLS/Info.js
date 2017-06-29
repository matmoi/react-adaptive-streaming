import React from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';
import HLSStream from './Stream.js';
import HLSTrack from './Track.js';
import DropdownPanel from '../../utils/DropdownPanel.js';

export default class HLSInfo extends React.Component {

    /**
     * Eliminate useless information from HLS config for text rendering, used for better reading clarity
     * @param {Object} config - Object containing untouched hls config
     * @return {Object} Object containing hls config with some missing properties
     */
    processHLSConfigForTextRendering(config) {
        const doNotPickUp = ["loader","fLoader","pLoader","xhrSetup","fetchSetup","abrController","bufferController","capLevelController","fpsController","audioStreamController","audioTrackController","subtitleStreamController","subtitleTrackController","timelineController","cueHandler"];
        return Object.entries(config).reduce((agg,x) => {
            if (! doNotPickUp.includes(x[0])) {
                agg[x[0]] = x[1];
            }
            return agg;
        }, {});
    }

    render() {
        const { mediaPlayer } = this.props;
        return (
            <div>
                hls.js <code> {Hls.version} </code>
                {mediaPlayer ?
                    <div>
                        <DropdownPanel title={`HLS config`} data={this.processHLSConfigForTextRendering(mediaPlayer.config)} defaultOpen={false}/>
                        <HLSStream mediaPlayer={mediaPlayer} />
                        <HLSTrack mediaPlayer={mediaPlayer} type="video" />
                        <HLSTrack mediaPlayer={mediaPlayer} type="audio" />
                        <HLSTrack mediaPlayer={mediaPlayer} type="subtitle" />
                    </div>
                    :
                    <div>Loading...</div>
                }
            </div>
        );
    }
};

HLSInfo.propTypes = {
    mediaPlayer: PropTypes.object
};