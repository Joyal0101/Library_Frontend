import React from 'react';

const About = () => {
  return (
    <div className="container">
      <div className="about">
        <div className="about-header">
          <h1 className="about-title">About Marchy's Library</h1>
          <p className="about-subtitle">
            Discover, learn, and grow with our comprehensive book management system in Letang-9 Jante, Morang
          </p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              Marchy's Library is designed to provide an efficient, 
              user-friendly platform for managing library resources and facilitating 
              the borrowing process. We believe in making knowledge accessible to everyone 
              in our community through modern technology and excellent service.
            </p>
          </div>

          <div className="about-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>Extensive Collection</h3>
                <p>
                  Browse through our vast collection of books covering various genres, 
                  subjects, and interests.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Easy Search</h3>
                <p>
                  Find the books you need quickly with our powerful search functionality 
                  by title, author, or ISBN.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Multi-Platform Access</h3>
                <p>
                  Access our library system from any device - web browser or mobile app 
                  for your convenience.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Role-Based Access</h3>
                <p>
                  Different interfaces for borrowers and librarians, ensuring the right 
                  tools for each user type.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Track Records</h3>
                <p>
                  Keep track of borrowing history, due dates, and library statistics 
                  for better management.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure & Reliable</h3>
                <p>
                  Your data is protected with modern security measures and reliable 
                  cloud infrastructure.
                </p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>For Borrowers</h2>
            <p>
              As a borrower, you can easily browse our collection, search for specific 
              books, and manage your borrowing history. Our system allows you to:
            </p>
            <ul className="feature-list">
              <li>Browse and search the entire book collection</li>
              <li>View detailed book information including availability</li>
              <li>Borrow books with a simple click</li>
              <li>Track your borrowing history and due dates</li>
              <li>Return books when you're done</li>
              <li>Update your profile information</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>For Librarians</h2>
            <p>
              Librarians have access to comprehensive management tools to maintain the 
              library collection and track all activities:
            </p>
            <ul className="feature-list">
              <li>Add, edit, and remove books from the collection</li>
              <li>Manage book quantities and availability</li>
              <li>View all borrowing records and statistics</li>
              <li>Track which books are most popular</li>
              <li>Monitor overdue books and user activity</li>
              <li>Generate reports for library management</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Technology Stack</h2>
            <p>
              Our system is built using modern web technologies to ensure reliability, 
              security, and performance:
            </p>
            <div className="tech-stack">
              <div className="tech-item">
                <strong>Frontend:</strong> React.js with responsive design
              </div>
              <div className="tech-item">
                <strong>Mobile App:</strong> React Native with Expo
              </div>
              <div className="tech-item">
                <strong>Backend:</strong> Node.js with Express.js
              </div>
              <div className="tech-item">
                <strong>Database:</strong> MongoDB with Mongoose ODM
              </div>
              <div className="tech-item">
                <strong>Authentication:</strong> JWT with bcrypt encryption
              </div>
              <div className="tech-item">
                <strong>Deployment:</strong> Cloud platforms for scalability
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Get Started</h2>
            <p>
              Ready to explore our library? Create an account today and start discovering 
              amazing books. Whether you're a student, researcher, or book lover, our 
              system is designed to enhance your reading experience.
            </p>
            <div className="cta-buttons">
              <a href="/register" className="btn btn-primary">
                Create Account
              </a>
              <a href="/contact" className="btn btn-secondary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
