
import React from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree'
import dashjs from 'dashjs'

export default class DashTrack extends React.Component {

    componentDidMount(){
        const { mediaPlayer, type } = this.props
        mediaPlayer.on(dashjs.MediaPlayer.events.METRICS_CHANGED, function (change) {
            this.forceUpdate()
        }.bind(this))
    }

    render() {
        const { mediaPlayer, type } = this.props
        const metrics = mediaPlayer.getMetricsFor(type)
        if (metrics) {
            return (
                <div>
                    <h2>Dash { type } metrics</h2>
                    <JSONTree data={ {
                        ...metrics
                    } } />
                </div>
            )
        } else {
            return (<div><h2>Dash {type} metrics</h2></div>)
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