import React from 'react';
import _ from 'lodash';
import config from '../config.js';

class DNA extends React.Component {
  constructor(props) {
    super(props);
    if (props && props.data) {
      this.polygons = props.data.polygons;
      this.canvas = props.data.canvas;
      this.diffScore = null;
      this.id = props.data.id;
    } else {
      // mutable vars
      this.id = _.uniqueId();
      this.polygons = [];
      this.canvas = null;
      this.diffScore = null;
    }
    this.age = 0;
  }

  clearCanvas() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.imageWidth, this.imageHeight);
    }
  }

  render() {
    const { canvasRef } = this.props;
    return <canvas id={this.id} ref={canvasRef} />
  }
}

export default DNA;