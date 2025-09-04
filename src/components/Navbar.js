import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isLibrarian } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <img src="/logo.svg" alt="Marchy's Library" className="navbar-logo" />
          
          </Link>

          <button 
            className="navbar-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className="navbar-toggle-icon"></span>
            <span className="navbar-toggle-icon"></span>
            <span className="navbar-toggle-icon"></span>
          </button>

          <div className={`navbar-menu ${isMenuOpen ? 'navbar-menu-open' : ''}`}>
            <div className="navbar-nav">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/" 
                    className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  
                  <Link 
                    to="/my-books" 
                    className={`navbar-link ${isActive('/my-books') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    My Books
                  </Link>
                  
                  {isLibrarian && (
                    <>
                      <Link 
                        to="/librarian" 
                        className={`navbar-link ${isActive('/librarian') ? 'active' : ''}`}
                        onClick={closeMenu}
                      >
                        Manage Books
                      </Link>
                      
                      <Link 
                        to="/librarian/borrow-records" 
                        className={`navbar-link ${isActive('/librarian/borrow-records') ? 'active' : ''}`}
                        onClick={closeMenu}
                      >
                        Borrow Records
                      </Link>
                    </>
                  )}
                  
                  <Link 
                    to="/about" 
                    className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    About
                  </Link>
                  
                  <Link 
                    to="/contact" 
                    className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Contact
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/about" 
                    className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    About
                  </Link>
                  
                  <Link 
                    to="/contact" 
                    className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Contact
                  </Link>
                </>
              )}
            </div>

            <div className="navbar-actions">
              {isAuthenticated ? (
                <div className="navbar-user">
                  <div className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">{user?.role}</span>
                  </div>
                  
                  <div className="user-menu">
                    <Link 
                      to="/profile" 
                      className="navbar-link"
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <button 
                      className="navbar-link logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="navbar-auth">
                  <Link 
                    to="/login" 
                    className="btn btn-primary"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-secondary"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
