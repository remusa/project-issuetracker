/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')
let _id

chai.use(chaiHttp)

suite('Functional Tests', function() {
    suite('POST /api/issues/{project} => object with issue data', function() {
      
        test('Every field filled in', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field filled in',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200)

                    assert.property(res.body, 'issue_title')
                    assert.property(res.body, 'issue_text')
                    assert.property(res.body, 'created_by')
                    assert.property(res.body, 'assigned_to')
                    assert.property(res.body, 'status_text')
                    assert.property(res.body, 'created_on')
                    assert.property(res.body, 'updated_on')
                    assert.property(res.body, 'open')
                    assert.property(res.body, '_id')

                    _id = res.body._id

                    assert.equal(res.body.issue_title, 'Title')
                    assert.equal(res.body.issue_text, 'text')
                    assert.equal(
                        res.body.created_by,
                        'Functional Test - Every field filled in'
                    )
                    assert.equal(res.body.assigned_to, 'Chai and Mocha')
                    assert.equal(res.body.status_text, 'In QA')

                    assert.isBoolean(res.body.open)
                    assert.equal(res.body.open, true)

                    done()
                })
        })

        test('Required fields filled in', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields filled in',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)

                    assert.property(res.body, 'issue_title')
                    assert.property(res.body, 'issue_text')
                    assert.property(res.body, 'created_on')
                    assert.property(res.body, 'updated_on')
                    assert.property(res.body, 'created_by')
                    assert.property(res.body, 'assigned_to')
                    assert.property(res.body, 'open')
                    assert.property(res.body, 'status_text')
                    assert.property(res.body, '_id')

                    _id = res.body._id

                    assert.equal(res.body.issue_title, 'Title')
                    assert.equal(res.body.issue_text, 'text')
                    assert.equal(
                        res.body.created_by,
                        'Functional Test - Required fields filled in'
                    )
                    assert.equal(res.body.assigned_to, '')
                    assert.equal(res.body.status_text, '')

                    assert.isBoolean(res.body.open)
                    assert.equal(res.body.open, true)

                    done()
                })
        })

        test('Missing required fields', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: '',
                    issue_text: '',
                    created_by: '',
                })
                .end((err, res) => {
                    assert.equal(res.status, 400)

                    assert.equal(res.text, 'missing required inputs')

                    done()
                })
        })
      
    })

    suite('PUT /api/issues/{project} => text', function() {
      
        test('No body', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({ _id: _id })
                .end((err, res) => {
                    assert.equal(res.status, 400)

                    assert.equal(res.text, 'no updated fields')

                    done()
                })
        })

        test('One field to update', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({ _id: _id, issue_text: 'updated text' })
                .end((err, res) => {
                    assert.equal(res.status, 200)

                    assert.equal(res.text, 'successfully updated')

                    done()
                })
        })

        test('Multiple fields to update', function(done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: _id,
                    issue_text: 'updated text',
                    open: false,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.equal(res.text, 'successfully updated')
                    done()
                })
        })
      
    })

    suite(
        'GET /api/issues/{project} => Array of objects with issue data',
        function() {
          
            test('No filter', function(done) {
                chai.request(server)
                    .get('/api/issues/test')
                    .query({})
                    .end(function(err, res) {
                        assert.equal(res.status, 200)

                        assert.isArray(res.body)

                        assert.property(res.body[0], 'issue_title')
                        assert.property(res.body[0], 'issue_text')
                        assert.property(res.body[0], 'created_on')
                        assert.property(res.body[0], 'updated_on')
                        assert.property(res.body[0], 'created_by')
                        assert.property(res.body[0], 'assigned_to')
                        assert.property(res.body[0], 'open')
                        assert.property(res.body[0], 'status_text')
                        assert.property(res.body[0], '_id')

                        done()
                    })
            })

            test('One filter', function(done) {
                chai.request(server)
                    .get('/api/issues/test')
                    .query({ open: true })
                    .end(function(err, res) {
                        assert.equal(res.status, 200)
                        assert.isArray(res.body)
                        assert.property(res.body[0], 'issue_title')
                        assert.property(res.body[0], 'issue_text')
                        assert.property(res.body[0], 'created_on')
                        assert.property(res.body[0], 'updated_on')
                        assert.property(res.body[0], 'created_by')
                        assert.property(res.body[0], 'assigned_to')
                        assert.property(res.body[0], 'open')
                        assert.property(res.body[0], 'status_text')
                        assert.property(res.body[0], '_id')
                        assert.equal(res.body[0].open, true)
                        done()
                    })
            })

            test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
                chai.request(server)
                    .get('/api/issues/test')
                    .query({ created_by: 'dante', open: false })
                    .end(function(err, res) {
                        assert.equal(res.status, 200)
                        assert.isArray(res.body)
                        assert.property(res.body[0], 'issue_title')
                        assert.property(res.body[0], 'issue_text')
                        assert.property(res.body[0], 'created_on')
                        assert.property(res.body[0], 'updated_on')
                        assert.property(res.body[0], 'created_by')
                        assert.property(res.body[0], 'assigned_to')
                        assert.property(res.body[0], 'open')
                        assert.property(res.body[0], 'status_text')
                        assert.property(res.body[0], '_id')
                        assert.equal(res.body[0].created_by, 'dante')
                        assert.equal(res.body[0].open, false)
                        done()
                    })
            })
          
        }
    )

    suite('DELETE /api/issues/{project} => text', function() {
      
        test('No _id', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 400)

                    assert.equal(res.text, '_id error')

                    done()
                })
        })

        test('Valid _id', function(done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({ _id: _id })
                .end((err, res) => {
                    assert.equal(res.status, 200)

                    assert.equal(res.text, `deleted ${_id}`)

                    done()
                })
        })
      
    })
})
