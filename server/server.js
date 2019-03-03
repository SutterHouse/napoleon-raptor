const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const ImageToolService = require('./services/imageToolService');
const ObjectStoreServiceClass = require('./services/objectStoreService');
const ObjectStoreService = new ObjectStoreServiceClass();
let app = express();

let port = 3013;

app.listen(port, () => {
    console.log('Listening on port: ', port);
});

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(fileUpload());

app.use(morgan('tiny'));

app.use(express.static(__dirname + '/../client/dist'));

app.get('/image/:imageId/pixels', (req, res) => {
    var image = ObjectStoreService.getImage(req.params.imageId);
    ImageToolService.getImagePixels(image).then((pixels) => {
        console.log('pixels', pixels);
        res.send(JSON.stringify(pixels)); 
    }).catch((err) => {
        console.log('ERROR READING IMAGE PIXELS');
    });
});

app.post('/image/:imageId', (req, res) => {
    console.log('IMAGEID:', req.params.imageId);
    console.log('FILE:', req.files.file);
    ObjectStoreService.saveImage(req.files.file.data, req.params.imageId);
    res.end();
});