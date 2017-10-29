import React from 'react';
import ReactDOM from 'react-dom';

export default class Separator extends React.Component {
  render() {
    return <hr className={"main mt-" + this.props.top + " mb-" + this.props.bottom}></hr>;
  }
}
