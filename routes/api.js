/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict'

const expect = require('chai').expect
const MongoClient = require('mongodb')
const ObjectId = require('mongodb').ObjectID

const CONNECTION_STRING = process.env.DB //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
    app.route('/api/issues/:project')

        .get((req, res) => {
            const project = req.params.project
        })

        .post((req, res) => {
            const project = req.params.project
        })

        .put((req, res) => {
            const project = req.params.project
        })

        .delete((req, res) => {
            const project = req.params.project
        })
}
