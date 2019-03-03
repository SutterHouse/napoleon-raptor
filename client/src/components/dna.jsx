import React from 'react';
import gaussian from 'gaussian';
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
    // config vars
    this.dnaPolygonCount = config.dna.polygonCount;
    this.dnaVertexCount = config.dna.vertexCount;
    this.imageWidth = config.image.width;
    this.imageHeight = config.image.height;
    this.dnaMutationProbability = config.dna.mutationProbability;
    this.dnaPolygonAlpha = config.dna.polygonAlpha;
    this.projectName = config.projectName;
  }

  componentDidMount() {
    this.canvas = document.getElementById(this.id);
      console.log('ID:', this.id);
      console.log('CANVAS:', this.canvas);
  }

  clearCanvas() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.imageWidth, this.imageHeight);
    }
  }

  renderToCanvas() {
    // create canvas if none exists
    if (!this.canvas) {
      this.canvas = document.getElementById(this.id);
      // console.log('ID:', this.id);
      // console.log('CANVAS:', this.canvas);
    }

    const ctx = this.canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, this.imageWidth, this.imageHeight);
    
    this.polygons.forEach((polygon) => {
      ctx.fillStyle = `rgba(${polygon.color.r}, ${polygon.color.g}, ${polygon.color.b}, ${this.dnaPolygonAlpha})`;
      ctx.beginPath();
      ctx.moveTo(polygon.coordinates[0].x, polygon.coordinates[0].y);
      for (var i = 1; i < polygon.coordinates.length; i++) {
        ctx.lineTo(polygon.coordinates[i].x, polygon.coordinates[i].y);
      }
      ctx.closePath();
      ctx.fill();
    });
  }

  getPixelData() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      return [...ctx.getImageData(0, 0, this.imageWidth, this.imageHeight).data];
    }
  }

  render() {
    return <canvas id={this.id}></canvas>;
  }
}

export default DNA;