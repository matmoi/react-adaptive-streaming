import React from 'react';
import PropTypes from 'prop-types';

import { VictoryAxis } from 'victory';
import Colors from '../../utils/Colors.js';
import NetworkTimeSeries from '../../utils/NetworkTimeSeries.js';
import PresentationTimeSeries from '../../utils/PresentationTimeSeries.js';
import { Tabs, Tab, Label, Badge } from 'react-bootstrap';

export default class HLSTimeSeries extends React.Component {

    render() {
        const {videoFragments, audioFragments, errors } = this.props;
        if (videoFragments.length === 0 && audioFragments.length === 0) {
            return (
                <div>
                    <code>Waiting for fragments</code>
                </div>
            );
        }
        const minTime = Math.min(
            ...[
                videoFragments.length > 0 && videoFragments[0].stats.trequest,
                audioFragments.length > 0 && audioFragments[0].stats.trequest
            ].filter(x => x)
        );
        const maxTime = Math.max(
            videoFragments.length > 0 ? videoFragments[videoFragments.length-1].stats.tbuffered : 0,
            audioFragments.length > 0 ? audioFragments[audioFragments.length-1].stats.tbuffered : 0
        );
        const xAxis =
            <VictoryAxis
                dependentAxis={false}
                tickValues={Array.from({length: 10}, (v, k) => k*Math.max((Math.round((maxTime-minTime) / 10000) * 1000),1000) + minTime)}
                tickFormat={(x) => Math.round((x-minTime) / 1000)}
                style={{
                    axis: {stroke: "#756f6a"},
                    ticks: {stroke: "grey"},
                    tickLabels: {fontSize: 8, padding: 0}
                }}
            />;
        const errorBadge =
            <div>Errors { ' ' }<Badge>{ errors.length }</Badge></div>;
        return (
            <Tabs defaultActiveKey={2} animation={false} id="hls-timeseries-tabs">
                <Tab eventKey={1} title="Network">
                    <NetworkTimeSeries VideoTimeSerie={videoFragments} AudioTimeSerie={audioFragments} x="stats.tbuffered" y="buffer.level" yAxisLabel="Buffer level (s)" xAxis={xAxis}/>
                    <NetworkTimeSeries VideoTimeSerie={videoFragments} AudioTimeSerie={audioFragments} x="stats.trequest" y={y => y.stats.tload-y.stats.tfirst} yAxisLabel="Latency (s)" yAxisTickFormat={y => y / 1000} xAxis={xAxis}/>
                    <NetworkTimeSeries VideoTimeSerie={videoFragments} AudioTimeSerie={audioFragments} x="stats.trequest" y={y => y.stats.bwEstimate || 0} yAxisLabel="Bw estimate (kbps)" yAxisTickFormat={y => y / 1000} xAxis={xAxis} interpolation="bundle"/>
                    <NetworkTimeSeries VideoTimeSerie={videoFragments} AudioTimeSerie={audioFragments} x="stats.trequest" y="frag.level" yAxisLabel="QualityIdx" xAxis={xAxis} interpolation="stepAfter"/>
                </Tab>
                <Tab eventKey={2} title="Presentation">
                    <PresentationTimeSeries VideoTimeSerie={videoFragments} AudioTimeSerie={audioFragments} x="frag.startPTS" y="stats.total" yAxisTickFormat={y => y / 1000} fillColor={c => Colors.get(c.frag.level)} />
                </Tab>
                <Tab eventKey={3} title={ errorBadge } disabled={errors.length === 0}>
                    {errors.map((err, i) =>
                        <div key={i}>
                            <Label>{`${err.t.getHours()}:${err.t.getMinutes()}:${err.t.getSeconds()}.${err.t.getMilliseconds()}`}</Label>
                            {err.fatal && <Label bsStyle="danger">Fatal</Label>}
                            <Label bsStyle="info">{err.type}</Label>
                            <code>{err.details}</code>
                        </div>
                    )}
                </Tab>
            </Tabs>
        );
    }
};

HLSTimeSeries.propTypes = {
    videoFragments:PropTypes.array,
    audioFragments:PropTypes.array,
    errors:PropTypes.array
};

HLSTimeSeries.defaultProps = {
    videoFragments:[],
    audioFragments:[],
    errors:[]
};