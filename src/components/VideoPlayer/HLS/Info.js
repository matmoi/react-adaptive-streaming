import React from 'react'
import PropTypes from 'prop-types'
import Hls from 'hls.js'
import HLSStream from './Stream.js'
import HLSTrack from './Track.js'

export default class HLSInfo extends React.Component {

    render() {
        const { mediaPlayer } = this.props
        return (
            <div>
                hls.js <code> {Hls.version} </code>
                {mediaPlayer ?
                    <div>
                        <HLSStream mediaPlayer={mediaPlayer} />
                        <HLSTrack mediaPlayer={mediaPlayer} type="video" />
                        <HLSTrack mediaPlayer={mediaPlayer} type="audio" />
                        <HLSTrack mediaPlayer={mediaPlayer} type="subtitle" />
                    </div>
                    :
                    <div>Loading...</div>
                }
            </div>
        )
    }
}

HLSInfo.propTypes = {
    mediaPlayer: PropTypes.object
};