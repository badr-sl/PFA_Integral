import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { logout } from '../../features/User/usersSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../CustomNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

const CustomNavbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (logout.fulfilled.match(result)) {
      navigate('/login', { replace: true });
      window.location.reload();
    }
  };

  return (
    <Navbar id="nav" bg="light" expand="lg" className="navbar-light custom-navbar">
      <Link id='titreNav' className="navbar-brand logo" to="/">
        [<span className="brackets">Badr</span>]<FontAwesomeIcon icon={faDesktop} className="pc-icon" />
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <div id='iconProfile' className="profile-wrapper">
            <NavDropdown
              title={<FaUserCircle size="1.5em" />}
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile"><FontAwesomeIcon icon={faUser} />  My Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item  onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} />  Logout</NavDropdown.Item>
            </NavDropdown>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
