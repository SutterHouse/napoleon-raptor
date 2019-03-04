import React from 'react';
import _ from 'lodash';
import DNA from './dna.jsx';
import { pixelDiff } from '../services/imageService.js';
import DNAService from '../services/dnaService.js';
import axios from 'axios';
import config from '../config';
require("babel-polyfill");

class GenePool extends React.Component {
  constructor(props) {
    super(props);

    // config vars
    this.settings = {
      projectName:                config.projectName,
      genePoolPopulationSize:     config.genePool.populationSize,
      dnaRenderCount:             config.dnaRenderCount,
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
    const { imageId } = props;
    this.imageId = imageId;
    this.dnas = _.times(this.settings.genePoolPopulationSize, () => this.dnaService.createDNA());
  }

  async componentDidMount() {
    await this.getSourceImagePixels();
      
    let epochIdx = 0;
    window.setInterval(() => {
      epochIdx++;
      if (epochIdx >= config.epochCount) { return; }
      this.advanceEpoch(epochIdx);
    }, 0);
  }

  advanceEpoch(epochIdx) {
    // change genetic code
    console.log('MUTATEALL');
    this.mutateAll();
    console.log('RENDER');
    console.log('CANVASES:', this.canvases);
    // this.incrementAges();
    // this.reapTheElderly();
    console.log('MATE');
    this.initiateMatingSeason();

    // post-render methods
    console.log('RENDER');
    console.log('CALCULATE DIFFS');
    this.calculateDiffs();
    console.log('SORTBYDIFF');
    this.sortDnasByDiff();
    console.log('CULL');
    this.cullAll();
    this.renderDNAs();
    if (epochIdx % 10 === 0) {
      // this.writeFittestToFile(epochIdx);
      console.log(`epoch: ${epochIdx}, minDiff: ${this.dnas[0].diffScore}`)
    }
    // this.introduceImmigrants(); // decide if we want to use this
  }

  getSourceImagePixels() {  // async
    return axios.get('/image/' + this.imageId + '/pixels').then((pixelArr) => {
      this.sourceImagePixels = pixelArr;
    });
  }

  calculateDiffs () {
    console.log('DNAS:', this.dnas);
    this.dnas.forEach((dna) => {
      this.dnaService.calculateDiff(dna, this.sourceImagePixels);
    });
  }

  sortDnasByDiff () {
    this.dnas.sort((dna1, dna2) => {
      return dna1.diffScore - dna2.diffScore;
    });
  }

  initiateMatingSeason () {
    const children = this.dnaService.matingSeason(this.dnas);
    this.dnas = _.concat(this.dnas, children);
  }

  incrementAges () {
    // this.dnas.forEach((dna) => {
    //   dna.age++;
    // });
  }

  reapTheElderly() {
    // this.dnas = this.dnas.filter((dna) => {
    //   return dna.age <= this.genePoolMaxAge;
    // });
  }

  cullAll () {
    this.dnas = this.dnas.slice(0, this.settings.genePoolPopulationSize);
  }

  mutateAll () {
    this.dnas.forEach(dna => this.dnaService.mutate(dna));
  }

  introduceImmigrants () {
    // const numberOfImmigrants = Math.floor(this.settings.genePoolPopulationSize * this.settings.genePoolImmigrantsPerEpoch);
    // this.setState({
    //   dnas: this.dnas.push(..._.times(numberOfImmigrants, () => new DNA().populate()))
    // });
  }

  renderDNAs() {
    _.times(this.settings.dnaRenderCount, (n) => this.dnaService.renderDna(this.dnas[n], this.canvases[n]));
  }

  render() {
    return <div>
      {_.times(this.settings.dnaRenderCount, (n) => <canvas ref={(ref) => this.canvases[n] = ref} key={n}/>)}
    </div>
  }

};

export default GenePool;