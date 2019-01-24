import React, { Component } from 'react';

class PlayerControls extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return nextProps;
	}

	playPause() {
		if(this.props.runAnimation) {
			return <i className="fa fa-pause" onClick={this.props.toggleRunAnimation}></i>
		} else {
			return <i className="fa fa-play" onClick={this.props.toggleRunAnimation}></i>
		}
	}

	render() {
		let playPause = this.playPause();
		return <div className="controls">
			<i onClick={() => {this.props.setPlaySpeed(1)}} className="fa fa-backward"></i>
			{playPause}
			<i onClick={() => {this.props.setPlaySpeed(0)}} className="fa fa-forward"></i>
		</div>;
	}
}

export default PlayerControls;
