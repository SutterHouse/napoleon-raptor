

class DNAService {
    constructor(imageWidth, imageHeight) {
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
    }

    populate() {
    this.polygons = _.times(this.dnaPolygonCount, () => ({
      coordinates: _.times(this.dnaVertexCount, this.createVertex.bind(this)),
      color: this.createColor(),
    }));
    
    // so that we can create a new populated DNA via `new DNA().populate()`
    return this;
  }
  
  mutate() {
    this.polygons.forEach((polygon) => {
      polygon.coordinates.forEach((coordinate) => {
        this.mutateCoordinate(coordinate);
      });

      this.mutateColor(polygon.color);

      // let's leave this out until there's a good reason for it:
      // this.mutateNumberOfVertices(polygon);
    });
  }

  createVertex() {
    return { x: _.random(this.imageWidth), y: _.random(this.imageHeight) };
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
    if (p <= this.dnaMutationProbability) {
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
    coordinate.x = this.mutateValue(coordinate.x, 0, this.imageWidth);
    coordinate.y = this.mutateValue(coordinate.y, 0, this.imageHeight);
  }

  mutateColor(color) {
    color.r = this.mutateValue(color.r, 0, 255, true);
    color.g = this.mutateValue(color.g, 0, 255, true);
    color.b = this.mutateValue(color.b, 0, 255, true);
  }

  mutateNumberOfVertices (polygon) {
    var pMutate = Math.random();
    if (pMutate < this.dnaMutationProbability) {
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
};