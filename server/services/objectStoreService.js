const _ = require('lodash');

class ObjectStoreService {
  constructor() {
      this.images = {};
  }

  saveImage(image, id) {
      this.images[id] = image;
  }

  getImage(id) {
      return this.images[id];
  }
}

module.exports = ObjectStoreService;
