import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../contexts/BookContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLibrarian } = useAuth();
  const { fetchBook, borrowBook, returnBook, loading, error } = useBooks();
  
  const [book, setBook] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const loadBook = async () => {
      const result = await fetchBook(id);
      if (result.success) {
        setBook(result.book);
      }
    };

    loadBook();
  }, [id, fetchBook]);

  const handleBorrow = async () => {
    if (!book || book.available <= 0) return;

    setActionLoading(true);
    setActionMessage('');
    
    const result = await borrowBook(book._id);
    
    if (result.success) {
      setBook(prev => ({ ...prev, available: prev.available - 1 }));
      setActionMessage('Book borrowed successfully!');
    } else {
      setActionMessage(result.message || 'Failed to borrow book');
    }
    
    setActionLoading(false);
  };

  const handleReturn = async () => {
    if (!book) return;

    setActionLoading(true);
    setActionMessage('');
    
    const result = await returnBook(book._id);
    
    if (result.success) {
      setBook(prev => ({ ...prev, available: prev.available + 1 }));
      setActionMessage('Book returned successfully!');
    } else {
      setActionMessage(result.message || 'Failed to return book');
    }
    
    setActionLoading(false);
  };

  const handleEdit = () => {
    navigate(`/librarian/book/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Book not found</h2>
          <p>The book you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isAvailable = book.available > 0;

  return (
    <div className="container">
      <div className="book-details">
        <div className="book-details-header">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary"
          >
            ← Back
          </button>
        </div>

        <div className="book-details-content">
          <div className="book-details-main">
            <div className="book-details-info">
              <h1 className="book-details-title">{book.title}</h1>
              <p className="book-details-author">by {book.author}</p>
              <p className="book-details-isbn">ISBN: {book.isbn}</p>
              
              <div className="book-details-availability">
                <div className="availability-info">
                  <span className={`availability-badge ${
                    isAvailable ? 'availability-available' : 'availability-unavailable'
                  }`}>
                    {isAvailable ? `${book.available} available` : 'Unavailable'}
                  </span>
                  <span className="total-copies">
                    {book.quantity} total copies
                  </span>
                </div>
              </div>

              {actionMessage && (
                <div className={`alert ${actionMessage.includes('success') ? 'alert-success' : 'alert-error'}`}>
                  {actionMessage}
                </div>
              )}

              <div className="book-details-actions">
                {isLibrarian ? (
                  <button
                    onClick={handleEdit}
                    className="btn btn-primary"
                  >
                    Edit Book
                  </button>
                ) : (
                  <button
                    onClick={handleBorrow}
                    disabled={!isAvailable || actionLoading}
                    className="btn btn-primary"
                  >
                    {actionLoading ? 'Processing...' : 'Borrow Book'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="book-details-sidebar">
            <div className="book-details-card">
              <h3>Book Information</h3>
              <div className="book-info-item">
                <strong>Title:</strong>
                <span>{book.title}</span>
              </div>
              <div className="book-info-item">
                <strong>Author:</strong>
                <span>{book.author}</span>
              </div>
              <div className="book-info-item">
                <strong>ISBN:</strong>
                <span>{book.isbn}</span>
              </div>
              <div className="book-info-item">
                <strong>Total Copies:</strong>
                <span>{book.quantity}</span>
              </div>
              <div className="book-info-item">
                <strong>Available:</strong>
                <span className={isAvailable ? 'text-success' : 'text-danger'}>
                  {book.available}
                </span>
              </div>
              <div className="book-info-item">
                <strong>Borrowed:</strong>
                <span>{book.quantity - book.available}</span>
              </div>
            </div>

            {!isLibrarian && (
              <div className="book-details-card">
                <h3>Borrowing Info</h3>
                <p>You can borrow this book for up to 14 days.</p>
                <p>Return it on time to avoid late fees.</p>
                {!isAvailable && (
                  <p className="text-warning">
                    This book is currently unavailable. Check back later!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
