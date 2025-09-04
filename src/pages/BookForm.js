import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBook, createBook, updateBook, loading } = useBooks();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: 1
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const loadBook = async () => {
      const result = await fetchBook(id);
      if (result.success) {
        const book = result.book;
        setFormData({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          quantity: book.quantity
        });
      }
    };
      loadBook();
    }
  }, [id,fetchBook]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 1) {
      newErrors.title = 'Title cannot be empty';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    } else if (formData.author.trim().length < 1) {
      newErrors.author = 'Author name cannot be empty';
    } else if (formData.author.trim().length > 100) {
      newErrors.author = 'Author name cannot exceed 100 characters';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else {
      // Basic ISBN validation
      const isbnRegex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
      if (!isbnRegex.test(formData.isbn.trim())) {
        newErrors.isbn = 'Please enter a valid ISBN';
      }
    }

    const quantity = parseInt(formData.quantity);
    if (!formData.quantity || isNaN(quantity)) {
      newErrors.quantity = 'Quantity is required';
    } else if (quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    } else if (quantity > 1000) {
      newErrors.quantity = 'Quantity cannot exceed 1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn.trim(),
      quantity: parseInt(formData.quantity)
    };

    let result;
    if (isEditing) {
      result = await updateBook(id, bookData);
    } else {
      result = await createBook(bookData);
    }

    if (result.success) {
      navigate('/librarian');
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    navigate('/librarian');
  };

  if (loading && isEditing) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="book-form">
        <div className="form-header">
          <h1 className="form-title">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h1>
          <p className="form-subtitle">
            {isEditing 
              ? 'Update the book information below'
              : 'Fill in the details to add a new book to the library'
            }
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter the book title"
                disabled={isSubmitting}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="author" className="form-label">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`form-input ${errors.author ? 'error' : ''}`}
                placeholder="Enter the author's name"
                disabled={isSubmitting}
              />
              {errors.author && (
                <span className="error-message">{errors.author}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="isbn" className="form-label">
                ISBN *
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={`form-input ${errors.isbn ? 'error' : ''}`}
                placeholder="Enter the ISBN (10 or 13 digits)"
                disabled={isSubmitting}
              />
              {errors.isbn && (
                <span className="error-message">{errors.isbn}</span>
              )}
              <small className="form-help">
                Enter the ISBN in any standard format (e.g., 978-0-7432-7356-5 or 9780743273565)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                Total Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`form-input ${errors.quantity ? 'error' : ''}`}
                placeholder="Enter the number of copies"
                min="1"
                max="1000"
                disabled={isSubmitting}
              />
              {errors.quantity && (
                <span className="error-message">{errors.quantity}</span>
              )}
              <small className="form-help">
                Number of copies of this book in the library
              </small>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditing ? 'Updating...' : 'Adding...') 
                  : (isEditing ? 'Update Book' : 'Add Book')
                }
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
