const express = require('express');
const router  = express.Router();
const Joi = require('joi');
const client = require('../db/connection.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var users, collection;



async function connectSetup(name, cname) {
    try {
        await client.connect();
        console.log('Connected');
        db = client.db(name)

        collection = db.collection(cname);
        //await collection.createIndex({"username": 1}, {unique: true});
        console.log("Connected to: " + name + "!");
        return collection;
        //collection.insertOne({"username": "gugu", "password": "booboo"});
    } catch(err) {
        console.log(err);
    }

}



const schema = Joi.object({
    username: Joi.string()
        .regex(/(^[a-zA-Z0-9_]+$)/)
        .min(2)
        .max(30)
        .required(),

    password: Joi.string()
        .trim()
        .min(10)
        .required(),
});

function createTokenSendResponse(user, res, next) {
    const payload = {
        _id: user._id,
        username: user.username
    };
    // make the token
    jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '1d',
    }, (err, token) => {
        if(err) {
            respondError422(res, next);
        } else {
            console.log(token);
            res.json({
                token
            });
        }
    });
}


router.get('/', (req, res) => {
    res.json({
        message : "Yo"
    });

});

router.post('/signup', (req, res, next) => {
    console.log('body', req.body);
    let bo = req.body;
    const result = Joi.validate(req.body, schema);
    if(result.error === null) {
        const dbObject = require('../index.js');
        console.log('got the object');
        dbObject.findOne({
            "username": bo.username
        }).then((user) => {
            if(user) {
                // there is already a user in the db with this username
                // respond with an error
                const err = new Error('That username is not OG. Please choose another one');
                res.status(409);
                next(err);
            } else {
                // hash the password
                // insert the user with the hashed password
                bcrypt.hash(bo.password.trim(), 12).then((hashedPass) => {
                    // create a new user
                    const newUser = {
                        username: bo.username,
                        password: hashedPass
                    };
                    dbObject.insertOne(newUser).then((insertedUser) => {
                        createTokenSendResponse(insertedUser.ops[0], res, next);
                        //res.json(insertedUser);
                        //console.log(insertedUser.ops[0]._id);
                    });
                    // insert the new user with the hashed password
                });
            }

        });
        //dbObject.insertOne({"username": bo.username, "password": bo.password});

        //make sure username is unique
    } else {
        res.status(406);
        next(result.error);
    }


});

function respondError422(res, next) {
    res.status(422);
    const error = new Error('Unable to login');
    next(error);
}

router.post('/login', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if(result.error === null) {
        const dbObject = require('../index.js');
        dbObject.findOne({
            "username": req.body.username
        }).then((user) => {
            if(user) {
                //found the user in the db
                // so the user actually exists
                // check the password
                console.log("Comparing...", req.body.password, ' with the hash ', user.password);
                bcrypt.compare(req.body.password, user.password)
                .then((result) => {
                    if(result) {
                        // right password
                        createTokenSendResponse(user, res, next);

                    } else {
                        // wrong password
                        respondError422(res, next);
                    }
                });
            } else {
                //user not found
                respondError422(res, next);
            }
        });
    } else {
        respondError422(res, next);
    }

});

module.exports = {
    router,
    connectSetup,
};