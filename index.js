const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const obj = require('./objects');
const userRouters = require('./routes/userRouters')
const express = require("express");
const app = express();


// connection à la database
const uri = obj.copDbUri;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("----------------------------")
    console.log(" Listen to port => " + port._connectionKey)
    console.log(" *** Database connected *** ")
    console.log("----------------------------")
}).catch(err => console.log(err));

// retour des données json
app.use(express.json());
// parser les données
app.use(bodyParser.json());

// creation du serveur
const port = http.createServer(app).listen(8080);

// requêtes 
app.use('/api', userRouters.routes);