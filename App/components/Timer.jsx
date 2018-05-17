import React from 'react';
import moment from 'moment';

class Timer extends React.Component {
  componentDidMount() {
    const { setTimerId } = this.props;
    const timerId = setInterval(this.props.changeTimer, 1000);
    setTimerId(timerId);
  }

  render() {
    const momentTime = moment(this.props.time, moment.ISO_8601);
    return (
      <div className="timer">Потрачено времени <span className="time">{momentTime.format('mm:ss')}</span></div>
    );
  }
}

export default Timer;
