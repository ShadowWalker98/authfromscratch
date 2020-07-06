const express = require('express');
const router  = express.Router();
const Joi = require('joi');
const client = require('../db/connection.js');
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
        .min(10).required(),
});



router.get('/', (req, res) => {
    res.json({
        message : "Yo"
    });

});

router.post('/signup', (req, res) => {
    console.log('body', req.body);
    const result = Joi.validate(req.body, schema);

    res.json(result);
});

module.exports = {
    router,
    connectSetup,
};