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
        const { mediaPlayer } = this.props
        mediaPlayer.on(dashjs.MediaPlayer.events.METRICS_CHANGED, function (change) {
            this.forceUpdate()
        }.bind(this))
    }

    render() {
        const { mediaPlayer, type } = this.props
        const metrics = mediaPlayer.getMetricsFor(type)
        return (
            <div>
                <Button onClick={ ()=> this.setState({ open: !this.state.open })} bsStyle="primary">Dash {type} metrics</Button>
                {metrics &&
                    <Panel collapsible expanded={this.state.open} bsClass="custom-panel">
                        <JSONTree hideRoot={ true } data={ {
                        ...metrics
                        } } />
                    </Panel>
                }
            </div>
        )
    }
}

DashTrack.propTypes = {
    mediaPlayer: PropTypes.object.isRequired,
    type: PropTypes.string
};

DashTrack.defaultProps = {
    type: 'audio'
}