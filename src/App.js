import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookProvider } from './contexts/BookContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import LibrarianDashboard from './pages/LibrarianDashboard';
import BookForm from './pages/BookForm';
import BorrowRecords from './pages/BorrowRecords';
import MyBooks from './pages/MyBooks';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/book/:id" element={
                  <ProtectedRoute>
                    <BookDetails />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/my-books" element={
                  <ProtectedRoute>
                    <MyBooks />
                  </ProtectedRoute>
                } />
                
                {/* Librarian Routes */}
                <Route path="/librarian" element={
                  <ProtectedRoute allowedRoles={['librarian']}>
                    <LibrarianDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/librarian/book/new" element={
                  <ProtectedRoute allowedRoles={['librarian']}>
                    <BookForm />
                  </ProtectedRoute>
                } />
                
                <Route path="/librarian/book/edit/:id" element={
                  <ProtectedRoute allowedRoles={['librarian']}>
                    <BookForm />
                  </ProtectedRoute>
                } />
                
                <Route path="/librarian/borrow-records" element={
                  <ProtectedRoute allowedRoles={['librarian']}>
                    <BorrowRecords />
                  </ProtectedRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;
