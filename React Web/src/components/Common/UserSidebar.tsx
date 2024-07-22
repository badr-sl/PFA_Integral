import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaUser, FaCog } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const UserSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="sidebar d-flex flex-column p-3 bg-light"style={{minWidth:"150px"}}>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className={`nav-item ${location.pathname === '/tasks' ? 'active' : ''}`}>
          <Link to="/Tasks" className="nav-link">
            <FaTasks className="me-2" /> Tasks
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <Link to="/profile" className="nav-link">
            <FaUser className="me-2" /> Profile
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <Link to="/settings" className="nav-link">
            <FaCog className="me-2" /> Settings
          </Link>
        </li>
        
      </ul>
    </div>
  );
};

export default UserSidebar;
