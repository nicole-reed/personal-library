/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const BookController = require('../controllers/bookController.js');

module.exports = function (app) {

  const bookController = new BookController();

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await bookController.getAllBooks(req)

        res.json(books)
      } catch (error) {
        console.log('error in GET /api/books:\n', error)

        res.send('no books found')
      }
    })

    .post(async (req, res) => {
      try {
        const book = await bookController.createBook(req)

        res.json(book)
      } catch (error) {
        res.send(error.message)
      }
    })

    .delete(async (req, res) => {
      try {
        const resBody = await bookController.deleteAllBooks(req)

        res.json(resBody)
      } catch (error) {
        res.json({
          error: error.message
        })
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      try {
        const book = await bookController.getOneBook(req)

        res.json(book)
      } catch (error) {
        res.send(error.message)
      }
    })

    .post(async (req, res) => {
      try {
        const addedComment = await bookController.addComment(req)

        res.json(addedComment)
      } catch (error) {
        res.send(error.message)
      }
    })

    .delete(async (req, res) => {
      try {
        const oneBookDeleted = await bookController.deleteOneBook(req)

        res.send(oneBookDeleted)
      } catch (error) {
        res.send(error.message)
      }
    });

};
