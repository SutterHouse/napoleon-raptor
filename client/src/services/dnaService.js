import gaussian from 'gaussian';
import _ from 'lodash';

class DNAService {
    constructor(settings) {
        this.settings = settings;
    }

    createDNAEgg() {
        const dna = {};
        dna.polygons = [];
        dna.id = _.uniqueId();
        return dna;
    }

    createDNA() {
        const dna = {};
        dna.id = _.uniqueId();
        return this.populate(dna);
    }

    populate(dna) {
    debugger;
    dna.polygons = _.times(this.settings.dnaPolygonCount, () => ({
      coordinates: _.times(this.settings.dnaVertexCount, () => this.createVertex(this.settings.imageWidth, this.settings.imageHeight)),
      color: this.createColor(),
    }));

    return dna;
  }

  mate (dna1, dna2) {
    var child = this.createDNAEgg();
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

  matingSeason (dnas) {
    const children = [];
    for (var i = 0; i < dnas.length; i++) {
      for (var j = 0; j < dnas.length; j++) {
        if (Math.random() < this.settings.genePoolMatingProbability) {
          children.push(this.mate(dnas[i], dnas[j]))
        }
      }
    }

    return children;
  }
  
  mutate(dna) {
    dna.polygons.forEach((polygon) => {
      polygon.coordinates.forEach((coordinate) => {
        this.mutateCoordinate(coordinate);
      });

      this.mutateColor(polygon.color);

      // let's leave this out until there's a good reason for it:
      // this.mutateNumberOfVertices(polygon);
    });
  }

  createVertex(width, height) {
    return { x: _.random(width), y: _.random(height) };
  }

  createColor() {
    return {
      r: _.random(255),
      g: _.random(255),
      b: _.random(255),
    };
  }

  mutateValue (original, min, max, isInteger = false) {
    // should mutation occur?
    const p = Math.random();
    let result = original;
    if (p <= this.settings.dnaMutationProbability) {
      // choose perturbation from a normal dist and apply to original value
      
      // we want most mutations to fall between min and max
      // 98% of results are within 2 standard deviations of the mean
      // so max - min represents a distance of 4 SDs
      const variance =  Math.pow((max - min) / 4, 2)
      var perturbation = gaussian(0, variance).ppf(Math.random());
      result += perturbation;
    }

    // check if result is invalid, try again if so
    if (result < min || result > max) {
      return this.mutateValue(original, min, max, isInteger);
    }

    // convert to integer if necessary
    if (isInteger) {
      result = Math.floor(result);
    }

    return result;
  }

  mutateCoordinate(coordinate) {
    coordinate.x = this.mutateValue(coordinate.x, 0, this.settings.imageWidth);
    coordinate.y = this.mutateValue(coordinate.y, 0, this.settings.imageHeight);
  }

  mutateColor(color) {
    color.r = this.mutateValue(color.r, 0, 255, true);
    color.g = this.mutateValue(color.g, 0, 255, true);
    color.b = this.mutateValue(color.b, 0, 255, true);
  }

  mutateNumberOfVertices (polygon) {
    var pMutate = Math.random();
    if (pMutate < this.settings.dnaMutationProbability) {
      var pAdd = Math.random();
      if (pAdd >= 0.5) {
        this.addVertex(polygon);
      } else {
        this.removeVertex(polygon);
      }
    }
  }

  addVertex (polygon) {
    var newVertex = this.createVertex(this.settings.imageWidth, this.settings.imageHeight);
    polygon.coordinates.push(newVertex);
  }

  removeVertex(polygon) {
    if (polygon.coordinates.length > 3) {
      var removalIndex = Math.floor(Math.random() * polygon.length);
      polygon.coordinates.splice(removalIndex, 1);
    }
  }

  calculateDiff(dna, sourcePixels) {
    var canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, this.settings.imageWidth, this.settings.imageHeight);
    
    dna.polygons.forEach((polygon) => {
    ctx.fillStyle = `rgba(${polygon.color.r}, ${polygon.color.g}, ${polygon.color.b}, ${this.settings.dnaPolygonAlpha})`;
    ctx.beginPath();
    ctx.moveTo(polygon.coordinates[0].x, polygon.coordinates[0].y);
    for (var i = 1; i < polygon.coordinates.length; i++) {
        ctx.lineTo(polygon.coordinates[i].x, polygon.coordinates[i].y);
    }
    ctx.closePath();
    ctx.fill();
    });

    const dnaPixels = [...ctx.getImageData(0, 0, this.settings.imageWidth, this.settings.imageHeight).data];
    return dnaPixels.reduce((score, current, idx) => {
        return score + Math.pow(current - sourcePixels[idx], 2);
    }, 0);
  }

  renderDna(dna, canvas) {
    // create canvas if none exists
    // if (!this.canvas) {
    //   this.canvas = document.getElementById(this.id);
    //   // const { canvasRef } = this.props;
    //   // this.canvas = <canvas id={this.id} ref={canvasRef} />;
    //   // console.log('ID:', this.id);
    //   // console.log('CANVAS:', this.canvas);
    //   console.log('CANVAS:', this.canvas);
    // }
    console.log('RENDER-DNA:', dna);
    console.log('RENDER-CANVAS:', canvas);
    if (!canvas) {
        return null;
    }

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, this.settings.imageWidth, this.settings.imageHeight);
    
    dna.polygons.forEach((polygon) => {
      ctx.fillStyle = `rgba(${polygon.color.r}, ${polygon.color.g}, ${polygon.color.b}, ${this.settings.dnaPolygonAlpha})`;
      ctx.beginPath();
      ctx.moveTo(polygon.coordinates[0].x, polygon.coordinates[0].y);
      for (var i = 1; i < polygon.coordinates.length; i++) {
        ctx.lineTo(polygon.coordinates[i].x, polygon.coordinates[i].y);
      }
      ctx.closePath();
      ctx.fill();
    });
  }
};

export default DNAService;