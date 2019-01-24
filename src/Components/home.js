import React, { Component } from 'react';
import LineGraph from './lineChart';
import MapView from './mapWindow';
import PlayerControls from './playerControls';
import SignalData from './signalData';

class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: props.data,
			speedData: [],
			signalData: [],
			runAnimation: false,
			positionIndex: 0,
			graphable: false,
			playSpeed: 2,
			playSpeedArray: [250, 500, 1000, 2000]
		}
		this.filterData=this.filterData.bind(this);
		this.toggleRunAnimation=this.toggleRunAnimation.bind(this);
		this.updatePositionIndex=this.updatePositionIndex.bind(this);
		this.setPlaySpeed=this.setPlaySpeed.bind(this);
		this.changeStartTime=this.changeStartTime.bind(this);
		this.changeEndTime=this.changeEndTime.bind(this);
	}

	componentDidMount() {
		this.filterData(this.state.data);
		this.updatePositionIndex();
	}

	toggleRunAnimation() {
		this.setState({ runAnimation: !this.state.runAnimation }, () => {
			this.updatePositionIndex();
		});
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.data !== prevState.data) {
			return { data: nextProps.data }
		} else {
			return null;
		}
	}

	componentDidUpdate(prevProps, prevSstate) {
		if(prevProps.data !== this.props.data){
			this.setState({ data: prevProps.data, graphable: false }, () => {
				this.filterData(prevProps.data);
			});
  		}
	}

	filterData(data) {
		let speedData = [],
			signalData = [],
			accelerationData = [],
			path = [],
			prevSpeed = 0,
			prevTime = 0,
			accelerationInterval = data.length > 100 ? Math.round(data.length / 100) : 1;

		data.forEach( (point, i) => {
			signalData.push({time: point.gpsEpochMillis, Signal: point.rssi});
			speedData.push({time: point.gpsEpochMillis, Speed: point.speed});

			let accCalc = i !== 0 ? (point.speed - prevSpeed) / ((point.gpsEpochMillis - prevTime) / 3600000) : 0;

			accelerationData.push({time: point.gpsEpochMillis, Acceleration: accCalc });
			path.push({ lat: point.lat, lng: point.long });

			prevSpeed = point.speed;
			prevTime = point.gpsEpochMillis;
		});
		this.setState({ speedData, signalData, accelerationData, path, graphable: true });
	}

	renderGraph(options) {
		if(this.state.graphable) {
			switch(options) {
				case 'speed' :
					return <LineGraph
								data={this.state.speedData}
								positionIndex={this.state.positionIndex}
								runAnimation={this.state.runAnimation}
								valueKey={'Speed'}/>;
				case 'signal' :
					return <LineGraph
								data={this.state.signalData}
								positionIndex={this.state.positionIndex}
								runAnimation={this.state.runAnimation}
								valueKey={'Signal'}/>;
				case 'accel' :
					return <LineGraph
								data={this.state.accelerationData}
								positionIndex={this.state.positionIndex}
								runAnimation={this.state.runAnimation}
								valueKey={'Acceleration'}/>;
				default :
					return;
			}
			
		} else {
			return '';
		}
	}

	renderMap() {
		if(this.state.path) {
			return <MapView
						positionIndex={this.state.positionIndex}
						runAnimation={this.state.runAnimation}
						path={this.state.path} />;
		} else {
			return '';
		}
	} 

	setPlaySpeed(direction) {
		switch(direction) {
			case 1 :
				if(this.state.playSpeed < this.state.playSpeedArray.length - 1) {
					this.setState({playSpeed: this.state.playSpeed + 1})
				}
				break;
			case 0 :
				if(this.state.playSpeed > 0) {
					this.setState({playSpeed: this.state.playSpeed - 1})
				}
				break;
			default :
				return;
		}
	}

	updatePositionIndex() {
		if(this.state.runAnimation) {
			setTimeout(() => {
				if(this.state.positionIndex < this.state.speedData.length - 1) {
					this.setState({ positionIndex: this.state.positionIndex + 1 });
					this.updatePositionIndex();
				} else {
					this.setState({ positionIndex: 0 });
					this.updatePositionIndex();
				}
			}, this.state.playSpeedArray[this.state.playSpeed]);
		}
	}

	renderSpeedData() {
		if (this.state.speedData.length) {
			return this.state.speedData[this.state.positionIndex].Speed;
		} else {
			return '';
		}
	}

	renderSignalData() {
		if (this.state.signalData.length) {
			return this.state.signalData[this.state.positionIndex].Signal;
		} else {
			return 0;
		}
	}

	changeStartTime(e) {
		this.setState({ positionIndex: 0 });
		this.props.changeStartTime(e);
	}

	changeEndTime(e) {
		this.setState({ positionIndex: 0 });
		this.props.changeEndTime(e);
	}

  	render() {
  		let startDate = new Date(this.props.startTime);
  		let endDate = new Date(this.props.endTime);
  		let speedData = this.renderSpeedData();
  		let signalData = this.renderSignalData();

  		startDate = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
  		endDate = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();

  		let speedGraph = this.renderGraph('speed'),
  			signalGraph = this.renderGraph('signal'),
  			accelGraph = this.renderGraph('accel'),
  			map = this.renderMap();

    	return (<div className="main-modal-container">
        	<div className="main-modal">
        		<div className="section-splitter">
	        		<div className="main-section">
	        			<div className="header">
	        				<h1>Vehicle Statistics</h1>
	        			</div>
	        			<div className="map">
	        				<div className="statistics">
	        					<span>Speed: {speedData}</span>
	        					<SignalData data={signalData} />
	        				</div>
	        				{map}
	        			</div>
	        			<div className="player-controls">
	        				<PlayerControls setPlaySpeed={this.setPlaySpeed} runAnimation={this.state.runAnimation} toggleRunAnimation={this.toggleRunAnimation} />
	        			</div>
	        		</div>
	        		<div className="controls">
	        			<div className="time-range-selectors">
		        			<div className="from-container">
			        			<label htmlFor="startDate">From</label>
			        			<input type="date" id="startDate" onChange={this.changeStartTime} defaultValue={startDate} />
		        			</div>
		        			<div className="to-container">
			        			<label htmlFor="endDate">To</label>
			        			<input type="date" id="endDate" onChange={this.changeEndTime} defaultValue={endDate}/>
			        		</div>
			        	</div>
	        			<div className="signal-graph">
	        				<span className="graph-title">Signal Strength</span>
	        				{signalGraph}
	        			</div>
	        			<div className="speed-graph">
	        				<span className="graph-title">Speed</span>
	        				{speedGraph}
	        			</div>
	        			<div className="acceleration-graph">
	        				<span className="graph-title">Acceleration</span>
	        				{accelGraph}
	        			</div>
	        		</div>
	        	</div>
        	</div>
      	</div>);
  	}
}

export default Home;
