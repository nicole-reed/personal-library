/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', async () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', async () => {


    suite('POST /api/books with title => create book object/expect book object', async () => {

      test('Test POST /api/books with title', async () => {
        const reqBody = { title: 'Fake Title' }
        const response = await chai.request(server)
          .post('/api/books')
          .send(reqBody)

        assert.equal(response.body.title, reqBody.title)
        assert.property(response.body, '_id')
        assert.property(response.body, 'title')
      });

      test('Test POST /api/books with no title given', async () => {
        const response = await chai.request(server)
          .post('/api/books')

        assert.equal(response.text, 'missing required field title')

      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', async () => {
        const testOne = { title: 'Test Book 1' }
        const testTwo = { title: 'Test Book 2' }
        const testThree = { title: 'Test Book 3' }

        await chai.request(server)
          .post('/api/books')
          .send(testOne)

        await chai.request(server)
          .post('/api/books')
          .send(testTwo)

        await chai.request(server)
          .post('/api/books')
          .send(testThree)

        const response = await chai.request(server)
          .get('/api/books')


        assert.isArray(response.body)
        assert.isAtLeast(response.body.length, 3)
      });

    });


    suite('GET /api/books/[id] => book object with [id]', async () => {

      test('Test GET /api/books/[id] with id not in db', async () => {
        const invalidId = '601080e98cb36a502cb1c470'
        const response = await chai.request(server)
          .get(`/api/books/${invalidId}`)

        assert.equal(response.text, 'no book exists')
      });

      test('Test GET /api/books/[id] with valid id in db', async () => {
        const testBook = { title: 'Get One By Id Test' }
        const postResponse = await chai.request(server)
          .post('/api/books')
          .send(testBook)

        const sampleBook = postResponse.body
        const testId = sampleBook._id

        const response = await chai.request(server)
          .get(`/api/books/${testId}`)

        assert.equal(response.body.title, sampleBook.title)
        assert.isObject(sampleBook);
        assert.property(sampleBook, 'title');
        assert.property(sampleBook, 'comments');
        assert.isArray(sampleBook.comments);
        assert.equal(response.body._id, testId)
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', async () => {

      test('Test POST /api/books/[id] with comment', async () => {
        const testBook = { title: 'Book To Add Comments To' }
        const comOne = { comment: 'A lovely book' }
        const comTwo = { comment: 'A stupid book' }

        const bookPostResponse = await chai.request(server)
          .post('/api/books')
          .send(testBook)

        const bookId = bookPostResponse.body._id

        await chai.request(server).post(`/api/books/${bookId}`).send(comOne)
        await chai.request(server).post(`/api/books/${bookId}`).send(comTwo)

        const response = await chai.request(server)
          .get(`/api/books/${bookId}`)

        assert.isObject(response.body);
        assert.property(response.body, 'title');
        assert.property(response.body, 'comments');
        assert.lengthOf(response.body.comments, 2);
      });

      test('Test POST /api/books/[id] without comment field', async () => {
        const testBook = { title: 'No comments to Add' }
        const postResponse = await chai.request(server)
          .post('/api/books')
          .send(testBook)

        const bookId = postResponse.body._id

        const response = await chai.request(server)
          .post(`/api/books/${bookId}`)

        assert.isString(response.text)
        assert.equal(response.text, 'missing required field comment');

      });

      test('Test POST /api/books/[id] with comment, id not in db', async () => {
        const testBook = { title: 'Comment but wrong _id' }
        const comment = { comment: 'test comment' }
        const wrongBookId = '60106d33b6f3df5830790d62'

        await chai.request(server)
          .post('/api/books')
          .send(testBook)

        const response = await chai.request(server)
          .post(`/api/books/${wrongBookId}`)
          .send(comment)

        assert.isString(response.text)
        assert.equal(response.text, 'no book exists')
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', async () => {

      test('Test DELETE /api/books/[id] with valid id in db', async () => {
        const testBook = { title: 'Book to Delete' }
        const postResponse = await chai.request(server)
          .post('/api/books')
          .send(testBook)

        const bookId = postResponse.body._id

        const response = await chai.request(server)
          .delete(`/api/books/${bookId}`)

        assert.isString(response.text)
        assert.equal(response.text, 'delete successful')
      });

      test('Test DELETE /api/books/[id] with  id not in db', async () => {
        const testBook = { title: 'Delete with wrong _id' }
        const wrongBookId = '60106d33b6f3df5830790d62'

        await chai.request(server)
          .post('/api/books')
          .send(testBook)

        const response = await chai.request(server)
          .delete(`/api/books/${wrongBookId}`)


        assert.isString(response.text)
        assert.equal(response.text, 'no book exists')
      });

    });

  });

});
