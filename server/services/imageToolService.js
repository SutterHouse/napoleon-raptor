const fs = require('fs');
const PNG = require('pngjs').PNG;


const getImagePixels = (imageBuffer) => {
  

  return new Promise((resolve, reject) => {
    if (imageBuffer) {
      try {
        var png = new PNG();
        png.parse(imageBuffer, (err, pixelBuffer) => {
          console.log('PIXELBUFFER:', [...pixelBuffer.data]);
          resolve([...pixelBuffer.data]);
        });
      } catch (err) {
        reject(err);
      }
    }
  });
}

// assumes that pixel arrays in same format
const pixelDiff = (pixels1, pixels2) => {
  return pixels1.reduce((score, current, idx) => {
    return score + Math.pow(current - pixels2[idx], 2);
  }, 0);
};

module.exports = { pixelDiff, getImagePixels };