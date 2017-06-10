import React from 'react'
import PropTypes from 'prop-types'
import JSONTree from 'react-json-tree'
import videojs from 'video.js'
import { Panel, Button } from 'react-bootstrap'

export default class PlayerInfo extends React.Component {

    constructor(...args) {
        super(...args)
        this.state = {
            open: true
        }
    }

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
                <Button onClick={ ()=> this.setState({ open: !this.state.open })} bsStyle="primary">Player</Button>
                <Panel collapsible expanded={this.state.open} bsClass="custom-panel">
                    <JSONTree hideRoot="true" data={ playerInfo } />
                </Panel>
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