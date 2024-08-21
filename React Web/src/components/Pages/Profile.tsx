import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../app/store';
import { updateUser } from '../../features/User/usersSlice';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { FaTimes, FaEdit } from 'react-icons/fa';
import '../../App.css';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  const [fetchedUser, setFetchedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || ''); 
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`http://localhost:8000/api/user/Profile/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        setFetchedUser(userData);
        setName(userData.name ?? '');
        setEmail(userData.email ?? '');
        setPhoneNumber(userData.PhoneNumber ?? ''); 
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setErrors({ ...errors, fetch: 'Failed to fetch user data' });
      }
    };

    fetchUserData();
  }, [user.id]);

  if (!fetchedUser) {
    return <div>Loading...</div>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      console.log('Sending update with:', {
        id: user.id,
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || '', 
      });
  
      const updatedUser = await dispatch(updateUser({ 
        id: user.id, 
        name: name.trim(),
        email: email.trim(),
        PhoneNumber: phoneNumber.trim() || '' 
      })).unwrap();
  
      console.log('Updated user data:', updatedUser);
  
      setName(updatedUser.name || '');
      setEmail(updatedUser.email || '');
      setPhoneNumber(updatedUser.PhoneNumber || '');
      setShowModal(false);
    } catch (err) {
      console.error('Failed to update user data', err);
      setErrors({ ...errors, update: 'Failed to update user data' });
    }
  };

  return (
    <Container className="profile-container mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="profile-card">
            <Card.Body>
              <div className="d-flex justify-content-end">
                <Button variant="link" onClick={handleBack} className="p-0 close-button">
                  <FaTimes size="1.5em" />
                </Button>
              </div>
              <div className="text-center mb-4">
                <img
                  src={`https://avatars.dicebear.com/api/initials/${fetchedUser.name}.svg`}
                  alt="Profile Avatar"
                  className="profile-avatar"
                />
              </div>
              <h2 className="text-center">My Profile</h2>
              <div className="profile-info">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Phone Number:</strong> {phoneNumber}</p>
              </div>
              <Button variant="primary" onClick={handleShowModal} className="mt-3 edit-button">
                <FaEdit className="me-2" /> Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && <Form.Text className="text-danger">{errors.phoneNumber}</Form.Text>}
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;
