import React from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree'
import videojs from 'video.js'

export default class PlayerInfo extends React.Component {

    render() {
        const { player, playerready } = this.props
        let playerInfo = {
            videojs: videojs.VERSION,
            browser: videojs.browser
        }
        if (playerready) {
            playerInfo = {
                ...playerInfo,
                techName: player.techName_,
                width: player.width(),
                height: player.height()
            }
        }
        return (
            <div>
                <h1>Player</h1>
                <JSONTree data={ playerInfo } />
            </div>
        )
    }
}

PlayerInfo.propTypes = {
  player: PropTypes.object,
  playerready: PropTypes.bool
};

PlayerInfo.defaultProps = {
    player: null,
    playerready: false
}