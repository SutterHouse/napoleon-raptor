module.exports = {
  projectName: 'genesis',
  epochCount: 10000,
  epochLogInterval: 100,
  dnaRenderCount: 6,
  dna: {
    polygonCount: 50,
    vertexCount: 3,
    mutationProbability: 0.1,
    polygonAlpha: 0.3
  },
  genePool: {
    populationSize: 10,
    matingProbability: 0.05,
    immigrantsPerEpoch: 0.2,
    maxAge: 10,
  },
  image: {
    dir: './spec/compareImages/monalisa.png',
    height: 350,
    width: 350,
  }
};
