const express = require('express');
const volleyball = require('volleyball');
const auth = require('./auth/index.js');
const notes = require('./api/notes.js');
const client = require('./db/connection.js');
const cors = require('cors');
require('dotenv').config();

var coll;

const app = express();
const middlewares = require('./auth/middlewares.js');
app.use(volleyball);

app.use(cors({
    origin: 'http://localhost:8080',
}));

app.use(express.json());
app.use(middlewares.checkTokenSetUser);



app.get('/', (req, res) => {
    res.json({
        message: "Hello World",
        user: req.user,
    });
})

app.use('/auth', auth.router);
app.use('/api/v1/notes', middlewares.isLoggedIn, notes);


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

async function connectToUsersDb() {
    coll = await auth.connectSetup('users', 'people');
}

const port = process.env.PORT || 5000;
try {
    app.listen(port, () => {
        console.log('Listening on port: '   , port);

        connectToUsersDb().then(() => {
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

