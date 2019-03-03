import gaussian from 'gaussian';
import _ from 'lodash';
import DNA from '../components/dna';

class DNAService {
    constructor(settings) {
        this.settings = settings;
    }

    populate(dna) {
    dna.polygons = _.times(this.settings.dnaPolygonCount, () => ({
      coordinates: _.times(this.settings.dnaVertexCount, this.createVertex(this.settings.imageWidth, this.settings.imageHeight)),
      color: this.createColor(),
    }));

    return dna;
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
    var newVertex = this.createVertex();
    polygon.coordinates.push(newVertex);
  }

  removeVertex(polygon) {
    if (polygon.coordinates.length > 3) {
      var removalIndex = Math.floor(Math.random() * polygon.length);
      polygon.coordinates.splice(removalIndex, 1);
    }
  }

  getPixelData(dna, canvas) {
      const ctx = canvas.getContext('2d');
      dna.diffScore = [...ctx.getImageData(0, 0, this.settings.imageWidth, this.settings.imageHeight).data];
  }
};

export default DNAService;