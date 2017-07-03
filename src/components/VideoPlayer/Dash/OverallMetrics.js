import React from 'react';
import PropTypes from 'prop-types';
import dashjs from 'dashjs';

import { VictoryPie } from 'victory';
import { Label, Button, ButtonGroup, Table } from 'react-bootstrap';

import Colors from "../../utils/Colors.js"

export default class DashOverallMetrics extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            lastUpdate: null
        };
        this.mediaPlayer = null;
    }

    componentDidMount() {
        this.mediaPlayer = this.props.mediaPlayer;
        this.observeMediaPlayer();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mediaPlayer !== nextProps.mediaPlayer) {
            this.mediaPlayer = nextProps.mediaPlayer;
            this.observeMediaPlayer();
        }
    }

    componentWillUnmount() {
        if (this.mediaPlayer) {
            this.mediaPlayer.off(dashjs.MediaPlayer.events.METRIC_CHANGED, null);
            this.mediaPlayer = null;
        }
    }

    observeMediaPlayer() {
        if (this.mediaPlayer) {
            this.mediaPlayer.on(dashjs.MediaPlayer.events.METRIC_CHANGED,
                function (change) {
                    let now = Date.now();
                    if (this.state.lastUpdate === null || now - this.state.lastUpdate > 2000) {
                        this.setState({ lastUpdate: now });
                        this.forceUpdate();
                    }
                }.bind(this)
            )
        }
    }

    qualityStatsForTrack(type) {
        if (this.mediaPlayer) {
            let metrics = this.mediaPlayer.getMetricsFor(type)
            if (metrics !== null) {
                return Object.values(
                    metrics.SchedulingInfo
                        .filter(x => x.state === "executed" && !isNaN(x.quality) && !isNaN(x.duration) && !isNaN(x.duration))
                        .map(x => Object.assign({bytes:x.range == null ? 0 : x.range.split('-').reduce((startByte,endByte) => endByte - startByte)}, x))
                        .reduce((acc,x) =>
                    {
                        if (acc[x.quality]) {
                            acc[x.quality].duration += x.duration;
                            acc[x.quality].card += 1;
                            acc[x.quality].bytes += x.bytes;
                        } else {
                            acc[x.quality] = {
                                duration:x.duration,
                                description: type === "video"
                                         ? `${this.mediaPlayer.getTracksFor("video")[0].bitrateList[x.quality].width}x${this.mediaPlayer.getTracksFor("video")[0].bitrateList[x.quality].height}`
                                         : `${Math.round(this.mediaPlayer.getTracksFor("audio")[0].bitrateList[x.quality].bandwidth / 1000)}kbps`,
                                index: x.quality,
                                card: 1,
                                bytes: x.bytes
                            };
                        }
                        return acc;
                    }
                ,{}));
            }
        }
        return []
    }

    renderStatsInfoForType(type,qualityIndex) {
        let totalSegments = qualityIndex.reduce((a,b) => a + b.card,0);
        return qualityIndex.map( x => 
            <tr style={{backgroundColor: Colors.get(x.index)}} key={`${type}${x.index}AggStatLine`}>
                <td>{x.index}</td>
                <td>{x.description}</td>
                <td>{x.card}</td>
                <td>{Math.round(x.card / totalSegments * 1000,2)/10}</td>
            </tr>
        );
    }

    render() {
        let renderComponents = { video: [], audio: [] }, type;
        if (this.mediaPlayer) {
            for (type of [  ...(this.mediaPlayer.getTracksFor("audio").length > 0 ? ['audio'] : []),
                            ...(this.mediaPlayer.getTracksFor("video").length > 0 ? ['video'] : [])]) {
                let qualityIndex = this.qualityStatsForTrack(type);
                let currentTrackIndex = this.mediaPlayer.getQualityFor(type);
                if (qualityIndex.length > 0) {
                    renderComponents[type].push(
                        <VictoryPie width={400} height={150}
                            data={qualityIndex}
                            x="index"
                            y="duration"
                            style={{
                                data: { stroke : "yellow",
                                        strokeWidth : x=>x.index === currentTrackIndex ? 4 : 0,
                                        fill: x => Colors.get(x.index)
                                      },
                                labels: { fontSize: 18 }
                            }}
                            key={`${type}QualityIdx`}
                            padding={{top:40,left:0,right:0,bottom:40}}
                            labels={x => (qualityIndex.filter(i => i.description === x.description).length > 1 ? `${x.description}[${x.index}]`:x.description)} //more than one index have same label ? then append index to label
                        />
                    );
                    
                    renderComponents[type].push(
                        <Table responsive key={`${type}StatTable`}>
                            <thead>
                            <tr>
                                <th>idx</th>
                                <th>label</th>
                                <th>#</th>
                                <th>%</th>
                            </tr>
                            </thead>
                            <tbody>
                            { this.renderStatsInfoForType(type,qualityIndex) }
                            </tbody>
                        </Table>
                    );

                    renderComponents[type].push(
                        <Label key={`${type}LabelTotalDownload`}>Total download: { Math.round(qualityIndex.reduce((acc,x)=>acc+x.bytes, 0) / 1000)} KBytes</Label>
                    )
                }
            }
        }
        return (
            <div>
                <ButtonGroup vertical block key={`VideoQualityIdxHeader`}>
                    <Button disabled bsStyle="primary">{`video metrics`}</Button>
                </ButtonGroup>
                {renderComponents.video}
                <ButtonGroup vertical block key={`AudioQualityIdxHeader`}>
                    <Button disabled bsStyle="primary">{`audio metrics`}</Button>
                </ButtonGroup>
                {renderComponents.audio}
            </div>
        );
    }
}

DashOverallMetrics.propTypes = {
    mediaPlayer: PropTypes.object
}