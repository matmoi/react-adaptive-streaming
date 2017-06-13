import React from 'react'
import PropTypes from 'prop-types'
import JSONTree from 'react-json-tree'
import dashjs from 'dashjs'
import { Panel, Button } from 'react-bootstrap'

export default class DashTrack extends React.Component {

    constructor(...args) {
        super(...args)
        this.state = {
            open: true
        }
    }

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
        const header = <h5>Dash {type} track</h5>
        if (track && qualityIndex !== null) {
            return (
                <div>
                    <Button onClick={ ()=> this.setState({ open: !this.state.open })} bsStyle="primary">Dash { type } track</Button>
                    <Panel collapsible expanded={this.state.open} bsClass="custom-panel">
                        <JSONTree hideRoot="true" data={ {
                        qualityIndex: qualityIndex,
                        bandwidth: track.bitrateList[qualityIndex].bandwidth,
                        width: track.bitrateList[qualityIndex].width,
                        height: track.bitrateList[qualityIndex].height,
                        codec: track.codec,
                        contentProtection: track.contentProtection,
                        mimeType: track.mimeType
                    } } />
                    </Panel>
                </div>
            )
        } else {
            return (<div>{ header }</div>)
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