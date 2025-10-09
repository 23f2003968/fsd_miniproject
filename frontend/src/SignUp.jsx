
import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineUser, AiOutlineLock, AiOutlineMail } from 'react-icons/ai';

const API_URL = 'http://localhost:3001/api';

const SignUp = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.token, data.user);
        navigate('/');
      } else {
        setError(data.message || 'Error creating account');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ maxWidth: '450px', width: '100%', borderRadius: '12px' }} className="shadow-sm border-0">
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <h2 style={{ fontWeight: '700', color: '#1877f2' }}>SocialHub</h2>
            <p className="text-muted">Create a new account</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <div className="position-relative">
                <AiOutlineUser 
                  size={20} 
                  className="position-absolute text-muted" 
                  style={{ top: '12px', left: '12px' }} 
                />
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ 
                    paddingLeft: '40px', 
                    borderRadius: '8px',
                    height: '50px',
                    backgroundColor: '#f0f2f5',
                    border: '1px solid #e0e0e0'
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="position-relative">
                <AiOutlineMail 
                  size={20} 
                  className="position-absolute text-muted" 
                  style={{ top: '12px', left: '12px' }} 
                />
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ 
                    paddingLeft: '40px', 
                    borderRadius: '8px',
                    height: '50px',
                    backgroundColor: '#f0f2f5',
                    border: '1px solid #e0e0e0'
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="position-relative">
                <AiOutlineLock 
                  size={20} 
                  className="position-absolute text-muted" 
                  style={{ top: '12px', left: '12px' }} 
                />
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ 
                    paddingLeft: '40px', 
                    borderRadius: '8px',
                    height: '50px',
                    backgroundColor: '#f0f2f5',
                    border: '1px solid #e0e0e0'
                  }}
                />
              </div>
              <Form.Text className="text-muted ms-2">
                Password must be at least 6 characters long.
              </Form.Text>
            </Form.Group>
            
            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                size="lg"
                style={{ borderRadius: '8px', fontWeight: '600', height: '50px' }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </Form>

          <hr className="my-4" />

          <div className="text-center">
            <p className="mb-0">
              Already have an account? <Link to="/signin" style={{ textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUp;
