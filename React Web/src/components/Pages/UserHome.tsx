import React from 'react';
import Layout from '../Layout/Layout';
import { Card, Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import '../../App.css'; 
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';






const UserHome: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const handleNavigationToProfile = () => {
    navigate('/profile'); 
  };
  const handleNavigationToTasks = () => {
    navigate('/tasks');
  };

  return (
    <Layout role="user">
      <Container className="user-home-container mt-5" id='userhome'>
        <Row className="mb-4">
          <Col>
            <Card className="welcome-card">
              <Card.Body>
                <Card.Title>Welcome,{user.name}!</Card.Title>
                <Card.Text>
                  Here is a summary of your recent activities and tasks.
                </Card.Text>
                <Button variant="primary" onClick={handleNavigationToProfile}>View Profile</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-4">
            <Card className="activity-summary-card">
              <Card.Header>Activity Summary</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>Tasks Completed: 5</ListGroup.Item>
                  <ListGroup.Item>Tasks Pending: 3</ListGroup.Item>
                  <ListGroup.Item>Messages: 2</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="recent-tasks-card">
              <Card.Header>Recent Tasks</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>Task 1</ListGroup.Item>
                  <ListGroup.Item>Task 2</ListGroup.Item>
                  <ListGroup.Item>Task 3</ListGroup.Item>
                </ListGroup>
                <Button variant="primary" className="mt-3" onClick={handleNavigationToTasks}>View All Tasks</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="useful-links-card">
              <Card.Header>Useful Links</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="#">Profile Settings</a></ListGroup.Item>
                  <ListGroup.Item><a href="#">Tasks</a></ListGroup.Item>
                  <ListGroup.Item><a href="#">Support</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default UserHome;
