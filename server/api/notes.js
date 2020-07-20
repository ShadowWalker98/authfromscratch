const express = require('express');
const router = express.Router();
const auth = require('../auth/index.js');
const Joi = require('joi');
const coll = require('../index.js');

async function connectToNotesDb() {
    let collection = await auth.connectSetup("users", "notes");
    return collection;
}

const schema = Joi.object({
    title: Joi.string()
        .min(2)
        .required(),

    note: Joi.string()
        .trim()
        .required(),
});

router.get('/', (req, res) => {
    connectToNotesDb()
    .then((collection) => {
        console.log(collection);
        collection.find({
            user_id: req.user._id
        }).toArray().then((result) => {
            res.json(result);
        });

    }).catch((err) => {
        console.log(err);
    });
});

router.post('/', (req, res, next) => {
    console.log("Hello I'm in the post route!");
    console.log(req.body);
    const result = Joi.validate(req.body, schema);
    if(result.error === null) {
        // insert into Database
        const newNote = {
            ...req.body,
            user_id: req.user._id
        }
        connectToNotesDb()
        . then((collection) => {
            collection.insertOne(newNote)
              .then((note) => {
                  res.json(note.ops);
              });
        });

    } else {
        const error = new Error(result.error);
        res.status(422);
        next(error);
    }
    // connectToNotesDb()
    //  .then((collection) => {
    //     //console.log(collection);
    //     // const newNote = {
    //     //     title: 'Hello2',
    //     //     note: 'BooBOO'
    //     // }
    //     // collection.insertOne(newNote).then((result) => {
    //     //     res.send(result.ops);
    //     //     //console.log(result)
    //     // })


    //  });

});


module.exports = router;