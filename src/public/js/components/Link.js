import React from 'react';
import ReactDOM from 'react-dom';

export default class Link extends React.Component {
  render() {
    return <a id={this.props.id} className={this.props.clazz} href={this.props.path} >{this.props.text}</a>;
  }
}
