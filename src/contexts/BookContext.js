import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const BookContext = createContext();

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const fetchBooks = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: 10
      };
      
      if (search) {
        params.search = search;
      }
      
      const response = await axios.get('/api/books', { params });
      const { books, totalPages, currentPage, total } = response.data;
      
      setBooks(books);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
      setTotalBooks(total);
      
      return { success: true, books };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch books';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const fetchBook = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/books/${id}`);
      return { success: true, book: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch book';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/books', bookData);
      const newBook = response.data.book;
      
      // Add the new book to the current list
      setBooks(prev => [newBook, ...prev]);
      setTotalBooks(prev => prev + 1);
      
      return { success: true, book: newBook };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create book';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`/api/books/${id}`, bookData);
      const updatedBook = response.data.book;
      
      // Update the book in the current list
      setBooks(prev => prev.map(book => 
        book._id === id ? updatedBook : book
      ));
      
      return { success: true, book: updatedBook };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update book';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(`/api/books/${id}`);
      
      // Remove the book from the current list
      setBooks(prev => prev.filter(book => book._id !== id));
      setTotalBooks(prev => prev - 1);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete book';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/borrow', { bookId });
      
      // Update the book's available count
      setBooks(prev => prev.map(book => 
        book._id === bookId 
          ? { ...book, available: book.available - 1 }
          : book
      ));
      
      return { success: true, borrow: response.data.borrow };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to borrow book';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (bookId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/borrow/return', { bookId });
      
      // Update the book's available count
      setBooks(prev => prev.map(book => 
        book._id === bookId 
          ? { ...book, available: book.available + 1 }
          : book
      ));
      
      return { success: true, borrow: response.data.borrow };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to return book';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchBooks(1, term);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    books,
    loading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    totalBooks,
    fetchBooks,
    fetchBook,
    createBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    searchBooks,
    clearError,
    setCurrentPage
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};
