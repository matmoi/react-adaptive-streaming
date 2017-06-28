import React from 'react'
import PropTypes from 'prop-types'
import JSONTree from 'react-json-tree'
import videojs from 'video.js'
import { OverlayTrigger, Button, Popover, ButtonGroup } from 'react-bootstrap'

export default class VideojsInfo extends React.Component {

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
        const popoverClickRootClose = (
            <Popover id="popover-trigger-click-root-close" positionLeft="0">
                <JSONTree hideRoot={ true } shouldExpandNode={ (keyName, data, level) => true } data={ playerInfo } />
            </Popover>
        )

        return (
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={ popoverClickRootClose }>
                <ButtonGroup vertical block key={`videoPlayerInfoButton`}>
                    <Button>Player info</Button>
                </ButtonGroup>
            </OverlayTrigger>
        )
    }
}

VideojsInfo.propTypes = {
    player: PropTypes.object,
    playerready: PropTypes.bool
};

VideojsInfo.defaultProps = {
    player: null,
    playerready: false
}