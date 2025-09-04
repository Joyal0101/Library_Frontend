import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BorrowRecords = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');


  
  useEffect(() => {
      const fetchBorrowRecords = async () => {
    try {
      setLoading(true);
      setError('');
      // const { currentPages } = response.data;
      
        const params = {
          page: currentPage,
          limit: 10
        };
      const response = await axios.get('/api/borrow/all', { params });
      
      const { borrows, totalPages } = response.data;
      
      
     
      if (statusFilter) {
        params.status = statusFilter;
      }
      
      
      setBorrows(borrows);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (error) {
      setError('Failed to fetch borrow records');
      console.error('Error fetching borrow records:', error);
    } finally {
      setLoading(false);
    }
  };
    fetchBorrowRecords();
  }, [currentPage, statusFilter]);
  
  

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDaysBorrowed = (borrowDate, returnDate) => {
    const start = new Date(borrowDate);
    const end = returnDate ? new Date(returnDate) : new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
          onClick={() => setCurrentPage(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
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
      <div className="borrow-records">
        <div className="records-header">
          <h1 className="records-title">Borrow Records</h1>
          <p className="records-subtitle">
            Track all borrowing activity in your library
          </p>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="status-filter" className="filter-label">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="">All Records</option>
              <option value="borrowed">Currently Borrowed</option>
              <option value="returned">Returned</option>
            </select>
          </div>
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
            <div className="records-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Borrower</th>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Return Date</th>
                    <th>Days Borrowed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.map(borrow => (
                    <tr key={borrow._id}>
                      <td>
                        <div className="borrower-info">
                          <div className="borrower-name">{borrow.userId?.name}</div>
                          <div className="borrower-email">{borrow.userId?.email}</div>
                        </div>
                      </td>
                      <td>
                        <div className="book-info">
                          <div className="book-title">{borrow.bookId?.title}</div>
                          <div className="book-author">by {borrow.bookId?.author}</div>
                          <div className="book-isbn">ISBN: {borrow.bookId?.isbn}</div>
                        </div>
                      </td>
                      <td>{formatDate(borrow.borrowDate)}</td>
                      <td>
                        {borrow.returnDate ? formatDate(borrow.returnDate) : '-'}
                      </td>
                      <td>
                        {calculateDaysBorrowed(borrow.borrowDate, borrow.returnDate)} days
                      </td>
                      <td>
                        <span className={`status-badge status-${borrow.status}`}>
                          {borrow.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {borrows.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <h3>No borrow records found</h3>
                  <p>
                    {statusFilter 
                      ? `No ${statusFilter} records found.`
                      : 'No borrowing activity has been recorded yet.'
                    }
                  </p>
                </div>
              )}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default BorrowRecords;
