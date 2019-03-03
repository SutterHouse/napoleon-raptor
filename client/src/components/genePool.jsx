import React from 'react';
import _ from 'lodash';
import DNA from './dna.jsx';
import { pixelDiff } from '../services/imageService.js';
import DNAService from '../services/dnaService.js';
import axios from 'axios';
import config from '../config';

class GenePool extends React.Component {
  constructor(props) {
    super(props);

    // config vars
    this.settings = {
      projectName:                config.projectName,
      genePoolPopulationSize:     config.genePool.populationSize,
      genePoolMatingProbability:  config.genePool.matingProbability,
      genePoolMaxAge:             config.genePool.maxAge,
      genePoolImmigrantsPerEpoch: config.genePool.immigrantsPerEpoch,
      dnaPolygonCount:            config.dna.polygonCount,
      dnaVertexCount:             config.dna.vertexCount,
      imageWidth:                 config.image.width,
      imageHeight:                config.image.height,
      dnaMutationProbability:     config.dna.mutationProbability,
      dnaPolygonAlpha:            config.dna.polygonAlpha
    }

    this.dnaService = new DNAService(this.settings);

    this.canvases = {};

    // mutable vars
    if (props && props.data) {
      this.imageId = props.data.imageId;
      this.state = {
        dnas: props.data.state.dnas
      }
    } else {
      this.state = {
        dnas: _.times(this.genePoolPopulationSize, () => new DNA().populate())
      }
    }
    console.log('STATE:', this.state);
  }

  getSourceImagePixels() {  // async
    return axios.get('/image/' + this.imageId + '/pixels').then((pixelArr) => {
      this.sourceImagePixels = pixelArr;
    });
  }

  calculateDiffs () {
    this.state.dnas.forEach((dna) => {
      dnaService.calculateDiff(dna, this.canvases[dna.id]);
    });
  }

  sortDnasByDiff () {
    this.state.dnas.sort((dna1, dna2) => {
      return dna1.diffScore - dna2.diffScore;
    });
  }

  mate (dna1, dna2) {
    var child = new DNA();
    for (var i = 0; i < dna1.polygons.length; i++) {
      var p = Math.random();
      if (p < 0.5) {
        child.polygons.push(_.cloneDeep(dna1.polygons[i]));
      } else {
        child.polygons.push(_.cloneDeep(dna2.polygons[i]));
      }
    }
    return child;
  }

  initiateMatingSeason () {
    const children = [];
    for (var i = 0; i < this.state.dnas.length; i++) {
      for (var j = 0; j < this.state.dnas.length; j++) {
        if (Math.random() < this.settings.genePoolMatingProbability) {
          children.push(this.mate(this.state.dnas[i], this.state.dnas[j]))
        }
      }
    }

    this.setState((prevState, props) => {
      var newPopulation = prevState.dnas.push(...children);
      console.log('PREVSTATE:', prevState);
      console.log('props:', props);
      return {
        dnas: newPopulation
      };
    });
  }

  incrementAges () {
    // this.state.dnas.forEach((dna) => {
    //   dna.age++;
    // });
  }

  reapTheElderly() {
    // this.state.dnas = this.state.dnas.filter((dna) => {
    //   return dna.age <= this.genePoolMaxAge;
    // });
  }

  cullAll () {
    this.state.dnas = this.state.dnas.slice(0, this.genePoolPopulationSize);
  }

  mutateAll () {
    this.state.dnas.forEach(dna => dna.mutate());
  }

  introduceImmigrants () {
    // const numberOfImmigrants = Math.floor(this.settings.genePoolPopulationSize * this.settings.genePoolImmigrantsPerEpoch);
    // this.setState({
    //   dnas: this.state.dnas.push(..._.times(numberOfImmigrants, () => new DNA().populate()))
    // });
  }

  render() {
    return <div>
      {_.map(this.state.dnas, (dna) => <DNA data={dna} />)}
    </div>
  }

};

export default GenePool;