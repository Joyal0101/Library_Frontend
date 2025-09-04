import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const isAvailable = book.available > 0;

  return (
    <div className="book-card">
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <p className="book-isbn">ISBN: {book.isbn}</p>
        
        <div className="book-availability">
          <span className={`availability-badge ${
            isAvailable ? 'availability-available' : 'availability-unavailable'
          }`}>
            {isAvailable ? `${book.available} available` : 'Unavailable'}
          </span>
          
          <span className="book-quantity">
            {book.quantity} total copies
          </span>
        </div>
      </div>

      <div className="book-actions">
        <Link 
          to={`/book/${book._id}`} 
          className="btn btn-primary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
