import React from 'react';
import PropTypes from 'prop-types';

import { VictoryPie } from 'victory';
import { Label, Button, ButtonGroup, Table } from 'react-bootstrap';

import Colors from "../../utils/Colors.js"

export default class HLSOverallMetrics extends React.Component {

    qualityStats(fragments,levels) {
        return Object.values(
            fragments.reduce((acc,f) =>
            {
                if (acc[f.frag.level]) {
                    acc[f.frag.level].duration += f.frag.duration;
                    acc[f.frag.level].card += 1;
                    acc[f.frag.level].bytes += f.stats.total;
                } else {
                    acc[f.frag.level] = {
                        duration:f.frag.duration,
                        description: levels[f.frag.level].attrs ? levels[f.frag.level].attrs.RESOLUTION : f.frag.level,
                        index: f.frag.level,
                        card: 1,
                        bytes: f.stats.total
                    };
                }
                return acc;
            }
        ,{}));
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
        const { fragments, currentLevel, levels } = this.props;
        let renderComponents = { main: [], audio: [] };
        for (let type of ['main','audio']) {
            if (fragments[type].length > 0) {
                let qualityIndex = this.qualityStats(fragments[type],levels[type]);
                if (qualityIndex.length > 0) {
                    renderComponents[type].push(
                        <VictoryPie width={400} height={150}
                            data={qualityIndex}
                            x="index"
                            y="duration"
                            style={{
                                data: { stroke : "yellow",
                                        strokeWidth : x=>x.index === currentLevel[type] ? 4 : 0,
                                        fill: x => Colors.get(x.index)
                                        },
                                labels: { fontSize: 18 }
                            }}
                            key={`HLS${type}QualityIdx`}
                            padding={{top:40,left:0,right:0,bottom:40}}
                            labels={x => (qualityIndex.filter(i => i.description === x.description).length > 1 ? `${x.description}[${x.index}]`:x.description)} //more than one index have same label ? then append index to label
                        />
                    );
                    
                    renderComponents[type].push(
                        <Table responsive key={`HLSVideoStatTable`}>
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
                        <div key={`HLS${type}LabelTotalDownload`}>
                            <Label>Total download: { Math.round(qualityIndex.reduce((acc,x)=>acc+x.bytes, 0) / 1000)} KBytes</Label>
                        </div>
                    )
                }
            }
        }
        return (
            <div>
                <ButtonGroup vertical block key='HLSVideoQualityIdxHeader'>
                    <Button disabled bsStyle="primary">video fragments</Button>
                </ButtonGroup>
                {renderComponents.main}
                <ButtonGroup vertical block key='HLSAudioQualityIdxHeader'>
                    <Button disabled bsStyle="primary">audio fragments</Button>
                </ButtonGroup>
                {renderComponents.audio}
            </div>
        );
    }
}

HLSOverallMetrics.propTypes = {
    fragments:PropTypes.object,
    currentLevel: PropTypes.object,
    levels: PropTypes.object,   // levels of video/audio tracks
};

HLSOverallMetrics.defaultProps = {
    fragments:{main:[],audio:[]},
};