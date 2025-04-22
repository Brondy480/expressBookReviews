const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);
  
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

const getBooksAsync = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 100); // Simulated delay
    });
  };
  
  // Task 10: Get the book list available in the shop using async/await
  public_users.get('/', async function (req, res) {
    try {
      const bookList = await getBooksAsync();
      return res.status(200).json(bookList);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching book list" });
    }
  });


// Get book details based on ISBN
// Async function to simulate fetching a book by ISBN
const getBookByISBNAsync = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
  };
  
  // Task 11: Get book details based on ISBN using async/await
  public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const book = await getBookByISBNAsync(isbn);
      return res.status(200).json(book);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  

  
// Get book details based on author
// Async function to simulate fetching books by Author
const getBooksByAuthorAsync = (author) => {
    return new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author");
      }
    });
  };
  
  // Task 12: Get book details based on Author using async/await
  public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const booksByAuthor = await getBooksByAuthorAsync(author);
      return res.status(200).json(booksByAuthor);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  

// Get all books based on title
// Async function to simulate fetching books by Title
const getBooksByTitleAsync = (title) => {
    return new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    });
  };
  
  // Task 13: Get book details based on Title using async/await
  public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
      const booksByTitle = await getBooksByTitleAsync(title);
      return res.status(200).json(booksByTitle);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
