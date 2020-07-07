const express = require('express');
const router  = express.Router();
const Joi = require('joi');
const client = require('../db/connection.js');
const bcrypt = require('bcryptjs');

var users, collection;
const dbname = "users";


async function connectSetup() {
    try {
        await client.connect();
        console.log('Connected');
        users = client.db(dbname)
        
        collection = users.collection("people");
        await collection.createIndex({"username": 1}, {unique: true});
        console.log("Connected to: " + dbname + "!");
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
                        res.json(insertedUser);
                    });
                    // insert the new user with the hashed password
                });
            }
            
        });
        //dbObject.insertOne({"username": bo.username, "password": bo.password});
        
        //make sure username is unique
    } else {
        next(result.error);
    }

    
});

module.exports = {
    router,
    connectSetup,
};