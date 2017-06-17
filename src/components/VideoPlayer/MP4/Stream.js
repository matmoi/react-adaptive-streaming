import React from 'react';
import PropTypes from 'prop-types';
import DropdownPanel from '../../utils/DropdownPanel.js'

export default class PlayerStream extends React.Component {

    shouldComponentUpdate(newProps,newState) {
        return (newProps.loadedmetadata && newProps.player)
    }
    render() {
        const { player } = this.props
        if (player) {
            return (
                <DropdownPanel title={"Stream"} data={{
                    src: player.currentSource().src,
                    duration: player.duration(),
                    type: player.currentSource().type,
                    isAudio: player.isAudio(),
                    videoWidth: player.videoWidth(),
                    videoHeight: player.videoHeight(),
                    poster: player.poster()
                }
                } />
            )
        }
        else {
            return (<div></div>)
        }
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