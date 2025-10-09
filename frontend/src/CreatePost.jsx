
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (media) {
        formData.append('media', media);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setContent('');
        setMedia(null);
        navigate('/');
      } else {
        setError(data.message || 'Error creating post');
      }
    } catch (error) {
      console.error('Create post error:', error);
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: '600px' }}>
      <h1 className="mb-4">Create Post</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicContent">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicMedia">
          <Form.Label>Media (Optional)</Form.Label>
          <Form.Control 
            type="file" 
            accept="image/*"
            onChange={(e) => setMedia(e.target.files[0])} 
          />
          <Form.Text className="text-muted">
            You can upload an image (max 5MB)
          </Form.Text>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating Post...' : 'Create Post'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreatePost;
