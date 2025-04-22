const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
}


const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

const accessToken = jwt.sign(
  { username },
  "fingerprint_customer", // ✅ Must match the one in index.js
  { expiresIn: '1h' }
);


  // 🔑 Save token and username in the session
  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "User logged in successfully", token: accessToken });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // Initialize reviews object if not already present
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review under the current user's name
  books[isbn].reviews[username] = review;

  return res.status(200).json({ 
    message: "Review added/updated successfully", 
    reviews: books[isbn].reviews 
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const reviews = books[isbn].reviews;
  
    // Check if user has posted a review
    if (!reviews[username]) {
      return res.status(404).json({ message: "Review by this user not found" });
    }
  
    // Delete the review
    delete reviews[username];
  
    return res.status(200).json({ message: `Review by '${username}' deleted successfully` });
  });
  



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
