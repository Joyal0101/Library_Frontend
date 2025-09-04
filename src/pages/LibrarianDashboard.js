import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';
import axios from 'axios';

const LibrarianDashboard = () => {
  const { books, loading, error, fetchBooks } = useBooks();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBorrows: 0,
    activeBorrows: 0,
    mostBorrowed: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchBooks(1, '');
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axios.get('/api/borrow/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${bookId}`);
        fetchBooks(1, '');
        fetchStats();
      } catch (error) {
        alert('Failed to delete book: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  return (
    <div className="container">
      <div className="librarian-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Librarian Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your library collection and track borrowing activity
          </p>
        </div>

        <div className="dashboard-actions">
          <Link to="/librarian/book/new" className="btn btn-primary">
            Add New Book
          </Link>
          <Link to="/librarian/borrow-records" className="btn btn-secondary">
            View All Records
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Total Books</h3>
              <p className="stat-number">{statsLoading ? '...' : stats.totalBooks}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-content">
              <h3>Total Borrows</h3>
              <p className="stat-number">{statsLoading ? '...' : stats.totalBorrows}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>Active Borrows</h3>
              <p className="stat-number">{statsLoading ? '...' : stats.activeBorrows}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Returned</h3>
              <p className="stat-number">{statsLoading ? '...' : stats.returnedBorrows}</p>
            </div>
          </div>
        </div>

        {/* Most Borrowed Books */}
        {stats.mostBorrowed && stats.mostBorrowed.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Most Borrowed Books</h3>
            </div>
            <div className="most-borrowed-list">
              {stats.mostBorrowed.map((item, index) => (
                <div key={index} className="most-borrowed-item">
                  <span className="rank">#{index + 1}</span>
                  <div className="book-info">
                    <h4>{item.title}</h4>
                    <p>by {item.author}</p>
                  </div>
                  <span className="borrow-count">{item.count} borrows</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books Management */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Book Collection</h3>
            <Link to="/librarian/book/new" className="btn btn-primary">
              Add Book
            </Link>
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
            <div className="books-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Total</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book._id}>
                      <td>
                        <Link to={`/book/${book._id}`} className="book-link">
                          {book.title}
                        </Link>
                      </td>
                      <td>{book.author}</td>
                      <td>{book.isbn}</td>
                      <td>{book.quantity}</td>
                      <td>
                        <span className={`availability-badge ${
                          book.available > 0 ? 'availability-available' : 'availability-unavailable'
                        }`}>
                          {book.available}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/librarian/book/edit/${book._id}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {books.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📚</div>
                  <h3>No books in collection</h3>
                  <p>Start by adding your first book to the library.</p>
                  <Link to="/librarian/book/new" className="btn btn-primary">
                    Add Your First Book
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
