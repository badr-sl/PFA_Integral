import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaUsers} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { faEye, faHouse, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="sidebar d-flex flex-column p-3 bg-light" style={{minWidth:"240px"}}>
      <ul className="nav nav-pills flex-column mb-auto">
      <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" className="nav-link">
            <FontAwesomeIcon icon={faHouse} /> Home
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/manage-tasks' ? 'active' : ''}`}>
          <Link to="/manage-tasks" className="nav-link">
            <FaTasks className="me-2" /> Manage Tasks
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/manage-users' ? 'active' : ''}`}>
          <Link to="/manage-users" className="nav-link">
            <FaUsers className="me-2" /> Manage Users
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/UserTasks' ? 'active' : ''}`}>
          <Link to="/UserTasks" className="nav-link">
          <FontAwesomeIcon icon={faEye} /> Manage Users Tasks
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/ChatBot' ? 'active' : ''}`}>
          <Link to="/ChatBot" className="nav-link">
          <FontAwesomeIcon icon={faRobot} />  ChatBot
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
