import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { AiOutlineHome, AiOutlinePlusCircle, AiOutlineLogout } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import CreatePost from './CreatePost';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  return (
    <Router>
      <Navbar bg="white" variant="light" expand="lg" className="shadow-sm sticky-top" style={{ borderBottom: '1px solid #e0e0e0' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ fontWeight: '700', fontSize: '24px', color: '#1877f2' }}>
            SocialHub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="d-flex align-items-center">
                <AiOutlineHome size={20} className="me-1" />
                <span style={{ fontWeight: '500' }}>Home</span>
              </Nav.Link>
              {isAuthenticated && (
                <Nav.Link as={Link} to="/create-post" className="d-flex align-items-center">
                  <AiOutlinePlusCircle size={20} className="me-1" />
                  <span style={{ fontWeight: '500' }}>Create</span>
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center me-3">
                    <FaUserCircle size={32} className="text-primary me-2" />
                    <span style={{ fontWeight: '600' }}>{user?.username}</span>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={handleLogout}
                    className="d-flex align-items-center"
                    style={{ borderRadius: '20px', fontWeight: '600' }}
                  >
                    <AiOutlineLogout size={18} className="me-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Nav.Link as={Link} to="/signin">
                    <Button variant="outline-primary" size="sm" style={{ borderRadius: '20px', fontWeight: '600' }}>
                      Sign In
                    </Button>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup">
                    <Button variant="primary" size="sm" style={{ borderRadius: '20px', fontWeight: '600' }}>
                      Sign Up
                    </Button>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 56px)' }}>
        <Container className="py-3">
          <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
            <Route 
              path="/signin" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <SignIn onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/signup" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <SignUp onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/create-post" 
              element={
                isAuthenticated ? <CreatePost /> : <Navigate to="/signin" />
              } 
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
