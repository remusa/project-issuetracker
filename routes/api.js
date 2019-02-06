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
            const query = req.query

            const queryParams = Object.keys(query).reduce((queryAcc, index) => {
                if (query[index] !== '') {
                    queryAcc[index] = query[index]
                }
                return queryAcc
            }, {})

            if (queryParams.open === 'false') {
                queryParams.open = false
            } else if (queryParams.open === 'true') {
                queryParams.open = true
            }

            if (queryParams.hasOwnProperty('_id')) {
                queryParams._id = ObjectId(queryParams._id)
            }

            MongoClient.connect(CONNECTION_STRING, (err, db) => {
                db.collection(project)
                    .find(queryParams)
                    .toArray((err, docs) => {
                        if (err) {
                            console.log(err)
                        }
                        res.status(200)
                        res.json(docs)

                        db.close()
                    })
            })
        })

        .post((req, res) => {
            const project = req.params.project
            const {
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
            } = req.body

            if (!issue_title || !issue_text || !created_by) {
                res.status(400)
                res.type('text')
                res.send('missing required inputs')
            }

            const newEntry = {
                issue_title,
                issue_text,
                created_by,
                assigned_to: assigned_to || '',
                status_text: status_text || '',
                created_on: new Date(),
                updated_on: new Date(),
                open: true,
            }

            if (
                !checkValid(issue_title) ||
                !checkValid(issue_text) ||
                !checkValid(created_by)
            ) {
                res.status(400)
                res.type('text')
                res.send('missing required inputs')
            }

            // if (!checkValid(assigned_to)) {
            //     newEntry.assigned_to = ''
            // }
            // if (!checkValid(status_text)) {
            //     newEntry.status_text = ''
            // }

            MongoClient.connect(CONNECTION_STRING, (err, db) => {
                db.collection(project).insertOne(newEntry, (err, doc) => {
                    if (err) {
                        db.close()
                        res.status(400)
                        res.type('html')
                        res.send(`Error: ${err}`)
                    }

                    res.status(200)
                    res.json(doc.ops[0])

                    console.log('_id: ', doc.ops[0])
                    db.close()
                })
            })
        })

        .put((req, res) => {
            const project = req.params.project
            const _id = req.body._id
            const {
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
                open,
            } = req.body

            try {
                ObjectId(_id)
            } catch (err) {
                res.status(400)
                res.type('text')
                res.send(`could not update ${_id}`)
            }

            const updatedEntry = {}

            if (checkValid(issue_title)) {
                updatedEntry.issue_title = issue_title
            }
            if (checkValid(issue_text)) {
                updatedEntry.issue_text = issue_text
            }
            if (checkValid(created_by)) {
                updatedEntry.created_by = created_by
            }
            if (checkValid(assigned_to)) {
                updatedEntry.assigned_to = assigned_to
            }
            if (checkValid(status_text)) {
                updatedEntry.status_text = status_text
            }
            if (open !== undefined) {
                updatedEntry.open = false
            }

            if (Object.keys(updatedEntry).length === 0) {
                res.status(400)
                res.type('text')
                res.send('no updated fields')
            }

            updatedEntry.updated_on = new Date()

            MongoClient.connect(CONNECTION_STRING, (err, db) => {
                db.collection(project).findOneAndUpdate(
                    { _id: ObjectId(_id) }, //filter
                    updatedEntry, //update
                    (err, doc) => {
                        if (err) {
                            db.close()

                            res.status(400)
                            res.type('text')
                            res.send('no updated fields')
                        }

                        db.close()

                        res.status(200)
                        res.type('text')
                        res.send('successfully updated')
                    }
                )
            })
        })

        .delete((req, res) => {
            const project = req.params.project
            const _id = req.body._id

            console.log('1 deleting')

            if (!checkValid(_id)) {
                res.status(400)
                res.type('text')
                res.send('_id error')
            }

            try {
                ObjectId(_id)
            } catch (err) {
                res.status(400)
                res.type('text')
                res.send('_id error')
            }

            MongoClient.connect(CONNECTION_STRING, (err, db) => {
                db.collection(project).findOneAndDelete(
                    { _id: ObjectId(_id) },
                    (err, doc) => {
                        if (err) {
                            res.status(400)
                            res.type('text')
                            res.send(`could not delete ${_id}`)

                            db.close()
                        }

                        res.status(200)
                        res.type('text')
                        res.send(`deleted ${_id}`)

                        db.close()
                    }
                )
            })
        })
}

function checkValid(entry) {
    if (entry === undefined || entry === '' || !entry) {
        return false
    }
    return true
}
