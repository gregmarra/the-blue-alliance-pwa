import React from 'react';
import PropTypes from 'prop-types';
import { componentPropType } from '@material-ui/utils';
import moment from 'moment';

class Countdown extends React.PureComponent {
  state = {
    curTime: null,
  }

  updateTime = () => {
    this.setState({curTime: moment()});
  }

  componentDidMount() {
    this.interval = setInterval(this.updateTime, this.props.interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {
      component,
      format,
      fallback,
      endTime,
      interval,
      ...restProps
    } = this.props;
    const { curTime } = this.state;
    const Component = component || <div />;

    let formattedCountdown;
    if (curTime) {
      let diff = moment(endTime).diff(this.state.curTime);
      formattedCountdown = moment.utc(diff).format(format, {trim: true});
    } else {
      formattedCountdown = fallback;
    }
    return <Component {...restProps}>{formattedCountdown}</Component>
  }
}

Countdown.propTypes = {
  component: componentPropType,
  format: PropTypes.string.isRequired,
  fallback: PropTypes.string.isRequired,
  endTime: PropTypes.object.isRequired,
  interval: PropTypes.number.isRequired,
}

export default Countdown;
