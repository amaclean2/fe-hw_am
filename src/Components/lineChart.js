import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

class TT extends Component {
	formatTime() {
		if(this.props.payload.length) {
			let payload = this.props.payload[0].payload;

			let time = new Date(payload.time),
				month = time.getMonth() + 1,
				day = time.getDate(),
				hour = time.getHours(),
				minutes = time.getMinutes();



			let formattedTime = month + '/' + day + ' ' + hour + ':' + minutes;
			let formattedValue = Math.round(payload[this.props.valueKey] * 100) / 100;

			return (<div className="tooltip">
				<span>Date: {formattedTime}</span>
				<span>{this.props.valueKey}: {formattedValue}</span>
			</div>);
		}
			
	}

	render() {
		let time = this.formatTime();
		return (<div className="tooltip-container">
			{time}
		</div>);
	}
}

class LineGraph extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: props.data,
			positionIndex: 0,
			runAnimation: false
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {runAnimation: nextProps.runAnimation, positionIndex: nextProps.positionIndex, data: nextProps.data};
	}

	formatXAxis(props) {
		let time = new Date(props),
			month = time.getMonth() + 1,
			day = time.getDate(),
			hour = time.getHours(),
			minutes = time.getMinutes();

		return month + '/' + day + ' ' + hour + ':' + minutes;
	}

	generateLine() {
		return (<ReferenceLine
					x={this.state.data[this.state.positionIndex].time}
					strokeWidth={1}
					stroke="#333" />);
	}

  	render() {
  		let refLine = this.generateLine();
    	return (<LineChart
    			width={400}
    			height={175}
    			margin={{top: 30, right: 10, left: -30, bottom: 0}}
    			data={this.state.data}>
    		<XAxis
    			dataKey={'time'}
    			tick={{ fontSize: 10 }}
    			tickFormatter={this.formatXAxis} />
    		<YAxis
    			tick={{ fontSize: 10 }} />
    		{refLine}
    		<ReferenceLine
					y={0}
					stroke="#333"
					strokeDasharray="5 5"/>
    		<Tooltip content={<TT valueKey={this.props.valueKey} />}/>
			<Line
				dataKey={this.props.valueKey}
				stroke={"#CC6666"}
				dot={false}/>
		</LineChart>);
  	}
}

export default LineGraph;
