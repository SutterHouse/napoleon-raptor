import React from 'react';
import ReactDom from 'react-dom';
import config from './config';
import GenePool from './components/genePool.jsx';
import axios from 'axios';
import _ from 'lodash';
require("babel-polyfill");

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        genePool: null
      };
  }

     async simulate() {
        
        await this.state.genePool.getSourceImagePixels();
      
        for (let epochIdx = 0; epochIdx < config.epochCount; epochIdx++) {
          await this.advanceEpoch(this.state.genePool, epochIdx);
        }
      }

      handleFiles(event) {
        var simulate = this.simulate.bind(this);
        const imageId = _.uniqueId();
        const data = new FormData();
        data.append('file', _.first(event.target.files));
        data.append('filename', imageId);
        axios.post('/image/' + imageId, data).then(() => {
          console.log('IMAGEID:', imageId);
          var genePool = new GenePool();
          genePool.imageId = imageId;
          this.setState({genePool: genePool}, simulate);
        });
      }
      
      advanceEpoch(genePool, epochIdx) {
        // change genetic code
        console.log('MUTATEALL');
        genePool.mutateAll();
        // genePool.incrementAges();
        // genePool.reapTheElderly();
        console.log('MATE');
        genePool.initiateMatingSeason();
        
        // post-render methods
        console.log('RENDER');
        genePool.renderDnas();
        console.log('CALCULATE DIFFS');
        genePool.calculateDiffs();
        console.log('SORTBYDIFF');
        genePool.sortDnasByDiff();
        console.log('CULL');
        genePool.cullAll();
      
        if (epochIdx % config.epochLogInterval === 0) {
          // genePool.writeFittestToFile(epochIdx);
          console.log(`epoch: ${epochIdx}, minDiff: ${genePool.dnas[0].diffScore}`)
        }
      
        // genePool.introduceImmigrants(); // decide if we want to use this
      }


  render() {
    console.log('APP-RENDER');
    var fileInput = !this.state.genePool ? <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleFiles.bind(this)}></input> : null;
    var genePool = this.state.genePool ? <GenePool data={this.state.genePool}></GenePool> : null;
    return (
          <div class='napoleon-raptor'>
            {fileInput}
            {genePool}
          </div>
      );
  }
}

ReactDom.render(<App />, document.getElementById('app'));