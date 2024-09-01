import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaUser } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { faChartGantt, faHouse, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="sidebar d-flex flex-column p-3 bg-light"style={{minWidth:"150px"}}>
      <ul className="nav nav-pills flex-column mb-auto">
      <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" className="nav-link">
            <FontAwesomeIcon icon={faHouse} /> Home
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/tasks' ? 'active' : ''}`}>
          <Link to="/Tasks" className="nav-link">
            <FaTasks className="me-2" /> Tasks
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <Link to="/profile" className="nav-link">
            <FaUser className="me-2" /> Profile
          </Link>
        </li><li className={`nav-item ${location.pathname === '/Gantt' ? 'active' : ''}`}>
          <Link to="/Gantt" className="nav-link">
          <FontAwesomeIcon icon={faChartGantt} fade /> Gantt
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

export default UserSidebar;
