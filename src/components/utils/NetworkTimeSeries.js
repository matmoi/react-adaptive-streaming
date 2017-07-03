import React from 'react';
import PropTypes from 'prop-types';
import { VictoryLegend, VictoryAxis, VictoryLine, VictoryChart } from 'victory';

export default class NetworkTimeSeries extends React.Component {

    legend = 
        <VictoryLegend
                    data={[
                        {name: 'video', labels: { fill: "#ff0000" }, symbol: {type:"circle",size:1}},
                        {name: 'audio', labels: { fill: "#ff00ff" }, symbol: {type:"circle",size:1}}
                        ]}
                    style={{
                        labels: { fontSize: 8 }
                    }}
                    colorScale={["#ff0000","#ff00ff"]}
                    symbolSpacer={0}
                    x={0}
                    y={0}
        />;

    render () {
        const { AudioTimeSerie, VideoTimeSerie, yAxisLabel, yAxisTickFormat, xAxis, x, y, interpolation } = this.props;

        return (
            <VictoryChart height={ 100 } padding={{top: 5, bottom: 20, left: 20, right:5}}>
                { this.legend }
                <VictoryAxis
                    dependentAxis={true}
                    tickFormat={yAxisTickFormat}
                    label={yAxisLabel}
                    style={{
                        axis: {stroke: "#756f6a"},
                        axisLabel: {fontSize: 8, padding: 12},
                        grid: {stroke: "grey"},
                        ticks: {stroke: "grey"},
                        tickLabels: {fontSize: 8, padding: 0}
                    }}
                />
                { xAxis }
                { VideoTimeSerie.length > 0 &&
                    <VictoryLine
                        data={ VideoTimeSerie }
                        x={x}
                        y={y}
                        sortKey="x"
                        scale="time"
                        style={{
                            data:{strokeWidth:1, stroke: "#ff0000"}
                        }}
                        interpolation={interpolation}
                    />
                }
                { AudioTimeSerie.length > 0 &&
                    <VictoryLine
                        data={ AudioTimeSerie }
                        x={x}
                        y={y}
                        sortKey="x"
                        scale="time"
                        style={{
                            data:{strokeWidth:1, stroke: "#ff00ff"}
                        }}
                        interpolation={interpolation}
                    />
                }
            </VictoryChart>
        )
    }
}

NetworkTimeSeries.propTypes = {
    AudioTimeSerie: PropTypes.arrayOf(PropTypes.object),
    VideoTimeSerie: PropTypes.arrayOf(PropTypes.object),
    yAxisLabel: PropTypes.string,
    yAxisTickFormat: PropTypes.func,
    xTickValues: PropTypes.element,
    x: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
    y: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
    interpolation: PropTypes.string
}

NetworkTimeSeries.defaultProps = {
    AudioTimeSerie: [],
    VideoTimeSerie: [],
    yAxisLabel: "",
    yAxisTickFormat: (t) => t,
    minTime: 0,
    interpolation: "linear"
}