import React, { Component } from 'react';
import Home from'./Components/home';
import './Styles/style.scss';

class App extends Component {
  constructor() {
    super()
    this.state = {
      url: 'https://alpha.skylo.io/api/devices/history/ids/(id)?since=(startTime)&until=(endTime)',
      id: 'dd7295fa-6c65-484d-b38d-30df3bc31c0c',
      startTime: 1542182400000,
      endTime: 1542268800000,
      authKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRqYXlAZm9yZC5jb20iLCJzeXN0ZW1Sb2xlIjoic3lzdGVtVXNlciIsImlhdCI6MTU0MTAwNzAzMiwiaXNzIjoiaHR0cDovL3dlYi1zZXJ2ZXJzLWRldi0xNDI1MzI1MDI4LnVzLXdlc3QtMi5lbGIuYW1hem9uYXdzLmNvbSIsInN1YiI6ImUyMmE2MjlkLWRlYTAtNDc0Yi04YzY5LTFlODQwYmZkMzRmYSIsImp0aSI6IjY0Nzk2YWIwLTlhYTItNGY3Ny04OTk4LWI1MzMzYzhlMmI5OCJ9.aIGEX_qigixaA17dcO0KNJay-R_704FDaugfkIAeVLA',
      data: []
    }

    this.getData=this.getData.bind(this);
    this.parseData=this.parseData.bind(this);
    this.changeStartTime=this.changeStartTime.bind(this);
    this.changeEndTime=this.changeEndTime.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  formatDate(timeStamp) {
    let date = new Date(timeStamp),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;

    return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + '.000';
  }

  changeStartTime(e) {
    this.setState({ startTime: new Date(e.target.value).getTime()}, () => {this.getData()});
  }

  changeEndTime(e) {
    this.setState({ endTime: new Date(e.target.value).getTime()}, () => {this.getData()});
  }

  getData() {
    let startTime = this.formatDate(this.state.startTime) + 'Z',
        endTime = this.formatDate(this.state.endTime),
        url = this.state.url.replace('(id)', this.state.id).replace('(startTime)', startTime).replace('(endTime)', endTime);

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.state.authKey
      })
    }).then( response => {
      return response.json();
    }).then( data => {
      this.parseData(data);
    })
  }

  parseData(data) {
    data = data.devices[this.state.id];
    data = data.filter( item => {
      return item.speed > 0;
    });
    this.setState({ data });
  }

  showHome() {
    if(this.state.data.length) {
      return <Home
          data={this.state.data}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          changeEndTime={this.changeEndTime}
          changeStartTime={this.changeStartTime} />;
    } else {
      return '';
    }
  }



  render() {
    let home = this.showHome();
    return (<div className="App">
        {home}
      </div>);
  }
}

export default App;
