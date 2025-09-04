import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../contexts/BookContext';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

const Dashboard = () => {
  const { user, isLibrarian } = useAuth();
  const { 
    books, 
    loading, 
    error, 
    searchTerm, 
    currentPage, 
    totalPages, 
    fetchBooks, 
    searchBooks,
    setCurrentPage 
  } = useBooks();

  const [localSearchTerm, setLocalSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks(1, '');
  }, []);

  const handleSearch = (term) => {
    setLocalSearchTerm(term);
    searchBooks(term);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBooks(page, searchTerm);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Welcome back, {user?.name}!
          </h1>
          <p className="dashboard-subtitle">
            {isLibrarian 
              ? 'Manage your library collection and track borrow records'
              : 'Discover and borrow books from our collection'
            }
          </p>
        </div>

        {isLibrarian && (
          <div className="dashboard-actions">
            <Link to="/librarian/book/new" className="btn btn-primary">
              Add New Book
            </Link>
            <Link to="/librarian/borrow-records" className="btn btn-secondary">
              View Borrow Records
            </Link>
          </div>
        )}

        <div className="search-container">
          <SearchBar 
            value={localSearchTerm}
            onChange={handleSearch}
            placeholder="Search books by title or author..."
          />
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
            {books.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📚</div>
                <h3>No books found</h3>
                <p>
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : isLibrarian 
                      ? 'Start by adding some books to your collection'
                      : 'No books are available at the moment'
                  }
                </p>
                {isLibrarian && !searchTerm && (
                  <Link to="/librarian/book/new" className="btn btn-primary">
                    Add Your First Book
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="books-grid">
                  {books.map(book => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>

                {renderPagination()}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
