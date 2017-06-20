import React from 'react'
import PropTypes from 'prop-types'
import dashjs from 'dashjs'
import DropdownPanel from '../../utils/DropdownPanel.js'

export default class DashMetrics extends React.Component {

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
            <DropdownPanel title={ `${type} metrics` } data={metrics}/>
        )
    }
}

DashMetrics.propTypes = {
    mediaPlayer: PropTypes.object.isRequired,
    type: PropTypes.string
};

DashMetrics.defaultProps = {
    type: 'audio'
}