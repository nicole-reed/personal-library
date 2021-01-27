const Book = require('../models/book.js');


class BookController {
  async createBook(request) {
    try {
      const { title } = request.body;

      if (!title) {
        throw new Error('missing required field title')
      }

      const book = new Book({
        title,
        comments: [],
        commentcount: 0
      })

      const createdBook = await book.save()

      return createdBook
    } catch (error) {
      console.log('error in createBook:\n', error)

      throw error
    }
  };

  async getAllBooks(request) {
    try {
      const { books } = request.params;
      const allBooks = await Book.find({ books })

      return allBooks
    } catch (error) {
      console.log('error in getBooks:\n', error)
    }
  };

  async getOneBook(request) {
    try {
      const { id } = request.params

      const response = await Book.findById(id)

      if (!response) {
        throw new Error('no book exists')
      }

      return response
    } catch (error) {
      console.log('error in getOneBook:\n', error)
      if (error.kind === 'ObjectId') {
        throw new Error('no book exists')
      }

      throw error
    }
  };

  async addComment(request) {
    try {
      const { id } = request.params
      const { comment } = request.body

      if (!comment) {
        throw new Error('missing required field comment')
      }


      const updateBody = {
        $push: { comments: comment },
        $inc: { commentcount: 1 }
      }

      const response = await Book.findByIdAndUpdate(id, updateBody, { useFindAndModify: false, new: true })
      console.log('response', response)

      if (!response) {
        throw new Error('no book exists')
      }

      return response
    } catch (error) {
      console.log('error in addComment:\n', error)

      throw error
    }
  };

  async deleteOneBook(request) {
    try {
      const { id } = request.params

      const response = await Book.findByIdAndDelete(id)

      if (!response) {
        throw new Error('no book exists')
      }

      return 'delete successful'
    } catch (error) {
      console.log('error in deleteOneBook:\n', error)

      throw error
    }
  };

  async deleteAllBooks(request) {
    try {
      const { books } = request.params;
      await Book.remove({ books })

      return 'complete delete successful'
    } catch (error) {
      console.log('error in deleteAllBooks:\n', error)
    }
  }

};

module.exports = BookController;