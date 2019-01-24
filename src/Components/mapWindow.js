import React, { Component } from 'react';
import { GoogleApiWrapper, Marker, Polyline, Map } from 'google-maps-react';

export class MapContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			position: props.path[0],
			positionIndex: 0,
			runAnimation: false
		}
	}
	onMarkerClick(props) {
		console.log(props);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {runAnimation: nextProps.runAnimation, positionIndex: nextProps.positionIndex};
	}

	refresh() {
		return <Marker position={this.props.path[this.state.positionIndex]} />;
	}

	makeCenter() {
		return this.props.path[this.state.positionIndex];
	}

	render() {
		let marker = this.refresh();
		let center = this.makeCenter();
		return <Map google={this.props.google}
					initialCenter={center}
					center={center}
					dispableDefaultUI={true}
					zoom={15}
					mapTypeControl={false}
					streetViewControl={false}
					onClick={this.onMapClicked} >

			<Polyline 
				path={this.props.path} 
				strokeColor="#CC6666" />
			{marker}
		</Map>;
	}
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyB4KLD018bx779YTP90yuKZMtUwEwPjVC0')
})(MapContainer)
