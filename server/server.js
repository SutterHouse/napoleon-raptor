const express = require('express');
const morgan = require('morgan');
let app = express();

let port = 3013;

app.listen(port, () => {
    console.log('Listening on port: ', port);
});

app.use(morgan('tiny'));

app.use(express.static(__dirname + '/../client/dist'));