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
  }

      handleFiles(event) {
        const imageId = _.uniqueId();
        const data = new FormData();
        data.append('file', _.first(event.target.files));
        data.append('filename', imageId);
        axios.post('/image/' + imageId, data).then(() => {
          console.log('IMAGEID:', imageId);
          this.imageId = imageId;
          this.forceUpdate();
        });
      }


  render() {
    console.log('APP-RENDER');
    var fileInput = !this.imageId ? <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleFiles.bind(this)}></input> : null;
    var genePool = this.imageId ? <GenePool imageId={this.imageId}></GenePool> : null;
    return (
          <div class='napoleon-raptor'>
            {fileInput}
            {genePool}
          </div>
      );
  }
}

ReactDom.render(<App />, document.getElementById('app'));