import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const MyBooks = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('borrowed');
  const [actionLoading, setActionLoading] = useState({});
    

   const fetchMyBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('/api/borrow/my-books', {
        params: { status: statusFilter }
      });
      
      setBorrows(response.data.borrows);
    } catch (error) {
      setError('Failed to fetch your books');
      console.error('Error fetching my books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBooksCallback = useCallback(fetchMyBooks, [statusFilter]);   

  useEffect(() => {
    fetchMyBooksCallback();
  }, [fetchMyBooksCallback]);


  const handleReturnBook = async (bookId) => {
    try {
      setActionLoading(prev => ({ ...prev, [bookId]: true }));
      
      const response = await axios.post('/api/borrow/return', { bookId });
      
      if (response.data.success) {
        // Remove the book from borrowed list
        setBorrows(prev => prev.filter(borrow => borrow.bookId._id !== bookId));
        
        // If we're viewing returned books, refresh the list
        if (statusFilter === 'returned') {
          fetchMyBooks();
        }
      }
    } catch (error) {
      alert('Failed to return book: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setActionLoading(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysBorrowed = (borrowDate, returnDate) => {
    const start = new Date(borrowDate);
    const end = returnDate ? new Date(returnDate) : new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateDaysRemaining = (borrowDate) => {
    const start = new Date(borrowDate);
    const end = new Date(start.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days
    const now = new Date();
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="container">
      <div className="my-books">
        <div className="my-books-header">
          <h1 className="my-books-title">My Books</h1>
          <p className="my-books-subtitle">
            Track your borrowing history and manage your current loans
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            onClick={() => setStatusFilter('borrowed')}
            className={`filter-tab ${statusFilter === 'borrowed' ? 'active' : ''}`}
          >
            Currently Borrowed ({borrows.length})
          </button>
          <button
            onClick={() => setStatusFilter('returned')}
            className={`filter-tab ${statusFilter === 'returned' ? 'active' : ''}`}
          >
            Returned Books
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {borrows.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  {statusFilter === 'borrowed' ? '📚' : '📖'}
                </div>
                <h3>
                  {statusFilter === 'borrowed' 
                    ? 'No books currently borrowed' 
                    : 'No returned books yet'
                  }
                </h3>
                <p>
                  {statusFilter === 'borrowed' 
                    ? 'Browse our collection to find books you\'d like to borrow.'
                    : 'Your returned books will appear here once you return some books.'
                  }
                </p>
                {statusFilter === 'borrowed' && (
                  <a href="/" className="btn btn-primary">
                    Browse Books
                  </a>
                )}
              </div>
            ) : (
              <div className="my-books-grid">
                {borrows.map(borrow => (
                  <div key={borrow._id} className="my-book-card">
                    <div className="book-info">
                      <h3 className="book-title">{borrow.bookId?.title}</h3>
                      <p className="book-author">by {borrow.bookId?.author}</p>
                      <p className="book-isbn">ISBN: {borrow.bookId?.isbn}</p>
                    </div>

                    <div className="borrow-info">
                      <div className="info-item">
                        <strong>Borrowed:</strong>
                        <span>{formatDate(borrow.borrowDate)}</span>
                      </div>
                      
                      {borrow.returnDate ? (
                        <div className="info-item">
                          <strong>Returned:</strong>
                          <span>{formatDate(borrow.returnDate)}</span>
                        </div>
                      ) : (
                        <div className="info-item">
                          <strong>Days Borrowed:</strong>
                          <span>{calculateDaysBorrowed(borrow.borrowDate)} days</span>
                        </div>
                      )}

                      {!borrow.returnDate && (
                        <div className="info-item">
                          <strong>Days Remaining:</strong>
                          <span className={calculateDaysRemaining(borrow.borrowDate) < 0 ? 'text-danger' : 'text-warning'}>
                            {calculateDaysRemaining(borrow.borrowDate) < 0 
                              ? 'Overdue' 
                              : `${calculateDaysRemaining(borrow.borrowDate)} days`
                            }
                          </span>
                        </div>
                      )}

                      <div className="info-item">
                        <strong>Status:</strong>
                        <span className={`status-badge status-${borrow.status}`}>
                          {borrow.status}
                        </span>
                      </div>
                    </div>

                    {!borrow.returnDate && (
                      <div className="book-actions">
                        <button
                          onClick={() => handleReturnBook(borrow.bookId._id)}
                          disabled={actionLoading[borrow.bookId._id]}
                          className="btn btn-success"
                        >
                          {actionLoading[borrow.bookId._id] ? 'Returning...' : 'Return Book'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBooks;
