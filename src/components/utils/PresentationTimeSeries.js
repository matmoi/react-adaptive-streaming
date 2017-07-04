import React from 'react';
import PropTypes from 'prop-types';
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory';
import Colors from './Colors.js';

export default class PresentationTimeSeries extends React.Component {

    render() {
        const { AudioTimeSerie, VideoTimeSerie, yAxisTickFormat, fillColor, x, y } = this.props;

        return (
            <div>
                { VideoTimeSerie.length &&
                    <VictoryChart height={ 100 } padding={{top: 5, bottom: 20, left: 20, right:5}}>
                        <VictoryAxis
                            dependentAxis={false}
                            style={{
                                axis: {stroke: "#756f6a"},
                                ticks: {stroke: "grey"},
                                tickLabels: {fontSize: 8, padding: 0}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis={true}
                            tickFormat={ yAxisTickFormat }
                            label="video chunk (KB)"
                            style={{
                                axis: {stroke: "#756f6a"},
                                axisLabel: {fontSize: 8, padding: 12},
                                grid: {stroke: "grey"},
                                ticks: {stroke: "grey"},
                                tickLabels: {fontSize: 8, padding: 0},
                            }}
                        />
                        <VictoryBar
                            data={VideoTimeSerie}
                            x={ x }
                            y={ y }
                            style= {{
                                data: {fill: fillColor}
                            }}
                        />
                    </VictoryChart>
                }
                { AudioTimeSerie.length &&
                    <VictoryChart height={ 100 } padding={{top: 5, bottom: 20, left: 20, right:5}}>
                        <VictoryAxis
                            dependentAxis={false}
                            style={{
                                axis: {stroke: "#756f6a"},
                                ticks: {stroke: "grey"},
                                tickLabels: {fontSize: 8, padding: 0}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis={true}
                            tickFormat={x => Math.round(x/1000)}
                            label="audio chunk (KB)"
                            style={{
                                axis: {stroke: "#756f6a"},
                                axisLabel: {fontSize: 8, padding: 12},
                                grid: {stroke: "grey"},
                                ticks: {stroke: "grey"},
                                tickLabels: {fontSize: 8, padding: 0},
                            }}
                        />
                        <VictoryBar
                            data={AudioTimeSerie}
                            x={ x } 
                            y={ y }
                            style= {{
                                data: {fill: fillColor}
                            }}
                            />
                    </VictoryChart>
                }
            </div>
        )
    }
};

PresentationTimeSeries.propTypes = {
    AudioTimeSerie: PropTypes.arrayOf(PropTypes.object),
    VideoTimeSerie: PropTypes.arrayOf(PropTypes.object),
    yAxisTickFormat: PropTypes.func,
    x: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
    y: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
    fillColor: PropTypes.func,   // function to fill bar with a certain colors
}

PresentationTimeSeries.defaultProps = {
    AudioTimeSerie: [],
    VideoTimeSerie: [],
    yAxisTickFormat: y => y,
    fillColor: c=>Colors.get(0)
}