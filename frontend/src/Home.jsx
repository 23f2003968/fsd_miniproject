
import React, { useState, useEffect } from 'react';
import { Card, Container, Button, Form, Badge, Alert, Spinner } from 'react-bootstrap';

const API_URL = 'http://localhost:3001/api';

const Home = ({ isAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
      setError('');
    } catch (error) {
      console.error('Fetch posts error:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      alert('Please sign in to like posts');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Like error:', error);
      alert('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    if (!isAuthenticated) {
      alert('Please sign in to comment');
      return;
    }

    const text = commentTexts[postId];
    if (!text || !text.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        setCommentTexts({ ...commentTexts, [postId]: '' });
        fetchPosts();
      }
    } catch (error) {
      console.error('Comment error:', error);
      alert('Failed to add comment');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPosts();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Posts</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {posts.length === 0 ? (
        <Alert variant="info">No posts yet. Be the first to create one!</Alert>
      ) : (
        posts.map((post) => {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const isOwner = currentUser.id === post.user?._id;
          
          return (
            <Card key={post._id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title>{post.user?.username || 'Unknown User'}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {formatDate(post.createdAt)}
                    </Card.Subtitle>
                  </div>
                  {isAuthenticated && isOwner && (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <Card.Text className="mt-3">{post.content}</Card.Text>
                {post.media && (
                  <Card.Img
                    variant="top"
                    src={`data:${post.mediaType};base64,${arrayBufferToBase64(
                      post.media.data
                    )}`}
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                )}
                <div className="mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleLike(post._id)}
                    className="me-2"
                  >
                    👍 Like {post.likes?.length > 0 && `(${post.likes.length})`}
                  </Button>
                  <Badge bg="secondary">{post.comments?.length || 0} Comments</Badge>
                </div>
                
                {/* Comments Section */}
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-3">
                    <h6>Comments:</h6>
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="border-start ps-3 mb-2">
                        <strong>{comment.user?.username || 'Unknown'}:</strong> {comment.text}
                        <div className="text-muted small">{formatDate(comment.createdAt)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                {isAuthenticated && (
                  <div className="mt-3">
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Write a comment..."
                        value={commentTexts[post._id] || ''}
                        onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post._id);
                          }
                        }}
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleComment(post._id)}
                    >
                      Comment
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default Home;
