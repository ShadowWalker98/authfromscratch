const express = require('express');
const volleyball = require('volleyball');
const auth = require('./auth/index.js');
const client = require('./db/connection.js');
var coll;

const app = express();
app.use(volleyball);
app.use(express.json());
//app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: "Hello World"
    });
})

app.use('/auth', auth.router);

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message:err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

async function connectToDb() {
    coll = await auth.connectSetup()
} 

const port = process.env.PORT || 5000;
try {
    app.listen(port, () => {
        console.log('Listening on port: '   , port);

        connectToDb().then(() => {
            module.exports = coll;
            //coll.insertOne({"username": "mumu", "password": "poopoo"});
        });
    
        
    }); 
} catch(err) {
    console.log(err);
} finally{
    console.log('done!');
    client.close();
}

