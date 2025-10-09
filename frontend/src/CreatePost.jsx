
import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSend, AiOutlineClose, AiOutlinePaperClip } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';

const API_URL = 'http://localhost:3001/api';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const isVideo = (type) => {
    if (!type) return false;
    return type.startsWith('video/') || 
           type.includes('matroska') || 
           type.includes('x-matroska');
  };

  const isImage = (type) => {
    if (!type) return false;
    return type.startsWith('image/');
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB');
        return;
      }

      // Check if it's an image or video
      const allowedImageTypes = /\.(jpeg|jpg|png|gif|webp|bmp|svg)$/i;
      const allowedVideoTypes = /\.(mp4|mkv|avi|mov|wmv|flv|webm|mpeg|mpg|3gp|m4v)$/i;
      
      const fileIsImage = file.type.startsWith('image/') || allowedImageTypes.test(file.name);
      const fileIsVideo = file.type.startsWith('video/') || 
                          file.type.includes('matroska') || 
                          allowedVideoTypes.test(file.name);
      
      if (!fileIsImage && !fileIsVideo) {
        setError('Only images and videos are allowed (MP4, MKV, AVI, MOV, etc.)');
        return;
      }

      setError('');
      setMedia(file);
      setMediaType(file.type);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType(null);
  };

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
        setMediaPreview(null);
        setMediaType(null);
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
    <Container style={{ maxWidth: '680px' }} className="mt-4">
      <Card className="shadow-sm border-0" style={{ borderRadius: '12px' }}>
        <Card.Body className="p-4">
          <div className="d-flex align-items-center mb-3">
            <h4 className="mb-0" style={{ fontWeight: '600' }}>Create Post</h4>
          </div>
          
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            {/* User Info */}
            <div className="d-flex align-items-center mb-3">
              <FaUserCircle size={40} className="text-primary me-2" />
              <div style={{ fontWeight: '600' }}>
                {currentUser.username || 'User'}
              </div>
            </div>

            {/* Content Input */}
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ 
                  border: 'none', 
                  fontSize: '16px',
                  resize: 'none',
                  backgroundColor: '#f0f2f5',
                  borderRadius: '8px'
                }}
              />
            </Form.Group>

            {/* Media Preview */}
            {mediaPreview && (
              <div className="position-relative mb-3">
                {isImage(mediaType) ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '400px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }} 
                  />
                ) : isVideo(mediaType) ? (
                  <video 
                    src={mediaPreview} 
                    controls
                    preload="metadata"
                    style={{ 
                      width: '100%', 
                      maxHeight: '400px',
                      borderRadius: '8px',
                      backgroundColor: '#000'
                    }} 
                  />
                ) : null}
                <Button
                  variant="light"
                  className="position-absolute top-0 end-0 m-2 rounded-circle p-2 shadow"
                  onClick={removeMedia}
                  style={{ width: '36px', height: '36px' }}
                >
                  <AiOutlineClose size={20} />
                </Button>
              </div>
            )}

            {/* Add to Post Section */}
            <div 
              className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
              style={{ 
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}
            >
              <span style={{ fontWeight: '600', fontSize: '15px' }}>Add to your post</span>
              <div>
                <Button
                  variant="link"
                  className="p-2 text-success"
                  onClick={() => document.getElementById('fileInput').click()}
                  style={{ textDecoration: 'none' }}
                  title="Attach photo or video"
                >
                  <AiOutlinePaperClip size={28} />
                </Button>
                <Form.Control 
                  id="fileInput"
                  type="file" 
                  accept="image/*,video/*,.mp4,.mkv,.avi,.mov,.wmv,.flv,.webm,.mpeg,.mpg,.3gp,.m4v"
                  onChange={handleMediaChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading || !content.trim()}
                size="lg"
                style={{ borderRadius: '8px', fontWeight: '600' }}
              >
                {loading ? (
                  <>Creating Post...</>
                ) : (
                  <>
                    <AiOutlineSend className="me-2" size={20} />
                    Post
                  </>
                )}
              </Button>
              <Button 
                variant="light" 
                onClick={() => navigate('/')}
                style={{ borderRadius: '8px', fontWeight: '600' }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreatePost;
