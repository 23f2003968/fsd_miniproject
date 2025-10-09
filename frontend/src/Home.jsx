
import React, { useState, useEffect } from 'react';
import { Card, Container, Button, Form, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineSend, AiOutlineDelete } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { BiImageAdd } from 'react-icons/bi';

const API_URL = 'http://localhost:3001/api';

const Home = ({ isAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentTexts, setCommentTexts] = useState({});
  const [showComments, setShowComments] = useState({});
  const [actionLoading, setActionLoading] = useState({});

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

  const isVideo = (mediaType) => {
    if (!mediaType) return false;
    return mediaType.startsWith('video/') || 
           mediaType.includes('matroska') || 
           mediaType.includes('x-matroska');
  };

  const isImage = (mediaType) => {
    if (!mediaType) return false;
    return mediaType.startsWith('image/');
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      alert('Please sign in to like posts');
      return;
    }

    // Optimistic update
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    setPosts(prevPosts => prevPosts.map(post => {
      if (post._id === postId) {
        const userLiked = post.likes?.some(like => like === currentUser.id);
        return {
          ...post,
          likes: userLiked 
            ? post.likes.filter(like => like !== currentUser.id)
            : [...(post.likes || []), currentUser.id]
        };
      }
      return post;
    }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Revert on error
        fetchPosts();
      }
    } catch (error) {
      console.error('Like error:', error);
      fetchPosts(); // Revert on error
    }
  };

  const handleComment = async (postId) => {
    if (!isAuthenticated) {
      alert('Please sign in to comment');
      return;
    }

    const text = commentTexts[postId];
    if (!text || !text.trim()) {
      return;
    }

    setActionLoading({ ...actionLoading, [postId]: true });

    try {
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Optimistic update
      const newComment = {
        user: { username: currentUser.username },
        text: text,
        createdAt: new Date().toISOString()
      };

      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment]
          };
        }
        return post;
      }));

      setCommentTexts({ ...commentTexts, [postId]: '' });

      const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        // Revert on error
        fetchPosts();
      }
    } catch (error) {
      console.error('Comment error:', error);
      fetchPosts(); // Revert on error
    } finally {
      setActionLoading({ ...actionLoading, [postId]: false });
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    // Optimistic delete
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Failed to delete post');
        fetchPosts(); // Revert on error
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
      fetchPosts(); // Revert on error
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const toggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: '680px' }} className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h2 className="mb-0" style={{ fontWeight: '600' }}>Feed</h2>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {posts.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <BiImageAdd size={60} className="text-muted mb-3" />
            <h5>No posts yet</h5>
            <p className="text-muted">Be the first to create one!</p>
          </Card.Body>
        </Card>
      ) : (
        posts.map((post) => {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const isOwner = currentUser.id === post.user?._id;
          const userLiked = post.likes?.some(like => like === currentUser.id);
          const commentsVisible = showComments[post._id];
          
          return (
            <Card key={post._id} className="mb-3 shadow-sm border-0" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-3">
                {/* Post Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <FaUserCircle size={40} className="text-primary me-2" />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>
                        {post.user?.username || 'Unknown User'}
                      </div>
                      <div className="text-muted" style={{ fontSize: '13px' }}>
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  {isAuthenticated && isOwner && (
                    <Button 
                      variant="link" 
                      className="text-danger p-0"
                      onClick={() => handleDelete(post._id)}
                      style={{ textDecoration: 'none' }}
                    >
                      <AiOutlineDelete size={20} />
                    </Button>
                  )}
                </div>

                {/* Post Content */}
                <Card.Text className="mb-2" style={{ fontSize: '15px', lineHeight: '1.5' }}>
                  {post.content}
                </Card.Text>

                {/* Post Media */}
                {post.media && (
                  <div className="mt-3 mb-2" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    {isImage(post.mediaType) ? (
                      <img
                        src={`data:${post.mediaType};base64,${arrayBufferToBase64(
                          post.media.data
                        )}`}
                        alt="Post media"
                        style={{ 
                          width: '100%', 
                          maxHeight: '500px', 
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    ) : isVideo(post.mediaType) ? (
                      <video
                        controls
                        preload="metadata"
                        style={{ 
                          width: '100%', 
                          maxHeight: '500px',
                          display: 'block',
                          backgroundColor: '#000'
                        }}
                      >
                        <source
                          src={`data:${post.mediaType};base64,${arrayBufferToBase64(
                            post.media.data
                          )}`}
                          type={post.mediaType}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </div>
                )}

                {/* Like and Comment Counts */}
                <div className="d-flex justify-content-between align-items-center mt-3 mb-2 px-1">
                  <span className="text-muted" style={{ fontSize: '13px' }}>
                    {post.likes?.length > 0 && `${post.likes.length} ${post.likes.length === 1 ? 'like' : 'likes'}`}
                  </span>
                  <span className="text-muted" style={{ fontSize: '13px' }}>
                    {post.comments?.length > 0 && `${post.comments.length} ${post.comments.length === 1 ? 'comment' : 'comments'}`}
                  </span>
                </div>

                <hr className="my-2" />

                {/* Action Buttons */}
                <div className="d-flex justify-content-around py-1">
                  <Button
                    variant="link"
                    className={`d-flex align-items-center justify-content-center flex-grow-1 text-decoration-none ${userLiked ? 'text-danger' : 'text-muted'}`}
                    onClick={() => handleLike(post._id)}
                    style={{ fontWeight: '600', fontSize: '15px' }}
                  >
                    {userLiked ? <AiFillHeart size={20} className="me-1" /> : <AiOutlineHeart size={20} className="me-1" />}
                    Like
                  </Button>
                  <Button
                    variant="link"
                    className="d-flex align-items-center justify-content-center flex-grow-1 text-muted text-decoration-none"
                    onClick={() => toggleComments(post._id)}
                    style={{ fontWeight: '600', fontSize: '15px' }}
                  >
                    <AiOutlineComment size={20} className="me-1" />
                    Comment
                  </Button>
                </div>

                <hr className="my-2" />

                {/* Comments Section */}
                {commentsVisible && post.comments && post.comments.length > 0 && (
                  <div className="mt-2 mb-2">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="d-flex mb-3">
                        <FaUserCircle size={32} className="text-secondary me-2 flex-shrink-0" />
                        <div className="flex-grow-1">
                          <div className="bg-light p-2 rounded" style={{ borderRadius: '18px' }}>
                            <div style={{ fontWeight: '600', fontSize: '13px' }}>
                              {comment.user?.username || 'Unknown'}
                            </div>
                            <div style={{ fontSize: '14px' }}>{comment.text}</div>
                          </div>
                          <div className="text-muted ms-2 mt-1" style={{ fontSize: '12px' }}>
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                {isAuthenticated && (
                  <div className="mt-3">
                    <InputGroup>
                      <div className="d-flex align-items-center me-2">
                        <FaUserCircle size={32} className="text-secondary" />
                      </div>
                      <Form.Control
                        placeholder="Write a comment..."
                        value={commentTexts[post._id] || ''}
                        onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleComment(post._id);
                          }
                        }}
                        style={{ borderRadius: '20px', backgroundColor: '#f0f2f5', border: 'none' }}
                        disabled={actionLoading[post._id]}
                      />
                      <Button
                        variant="link"
                        className="ms-2 p-0 text-primary"
                        onClick={() => handleComment(post._id)}
                        disabled={!commentTexts[post._id]?.trim() || actionLoading[post._id]}
                        style={{ textDecoration: 'none' }}
                      >
                        {actionLoading[post._id] ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <AiOutlineSend size={24} />
                        )}
                      </Button>
                    </InputGroup>
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
