import React from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree'

export default class PlayerStream extends React.Component {

    render() {
        const { player, loadedmetadata } = this.props
        if (loadedmetadata) {
            return (
                <div>
                    <h1>Stream</h1>
                    <JSONTree hideRoot="true" data={ {
                        src: player.currentSource().src,
                        duration: player.duration(),
                        type: player.currentSource().type,
                        isAudio: player.isAudio(),
                        videoWidth: player.videoWidth(),
                        videoHeight: player.videoHeight(),
                        poster: player.poster()
                    } } />
                </div>
            )
        }
        return (
            <div>
                <h1>Stream</h1>
                <span> Not loaded </span>
            </div>
        )
    }
}

PlayerStream.propTypes = {
    player: PropTypes.object,
    loadedmetadata: PropTypes.bool
};

PlayerStream.defaultProps = {
    player: null,
    loadedmetadata: false
}