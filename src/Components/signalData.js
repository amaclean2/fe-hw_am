import React, { Component } from 'react';

class SignalData extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: 0
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {data: nextProps.data};
	}

	render() {
		return <div className="signal-container">
			<div className={this.state.data >= 1 ? 'full' : ''}></div>
			<div className={this.state.data >= 2 ? 'full' : ''}></div>
			<div className={this.state.data >= 3 ? 'full' : ''}></div>
			<div className={this.state.data >= 4 ? 'full' : ''}></div>
		</div>;
	}
}

export default SignalData;
