import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { fetchAllUsers, createUser, updateUser } from '../../features/User/usersSlice';
import Navbar from '../Common/Navbar';
import AdminSidebar from '../Common/AdminSidebar';
import { FaUserPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';

const ManageUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, validationErrors } = useSelector((state: RootState) => state.users);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    password: '',
    PhoneNumber: '',
    role: 'user'
  });
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...newUser }; 
    if (isEditMode && editUserId !== null) {
      const result = await dispatch(updateUser({ id: editUserId, ...updatedUser }));
      if (updateUser.fulfilled.match(result)) {
        setShowModal(false);
        setEditUserId(null);
        setNewUser({ name: '', password: '', PhoneNumber: '', role: 'user' });
      }
    } else {
      const result = await dispatch(createUser({ ...updatedUser, email }));
      if (createUser.fulfilled.match(result)) {
        setShowModal(false);
        setNewUser({ name: '', password: '', PhoneNumber: '', role: 'user' });
      }
    }
  };

  const handleAddUser = () => {
    setNewUser({ name: '', password: '', PhoneNumber: '', role: 'user' });
    setEmail('');
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (user: any) => {
    setEditUserId(user.id);
    setNewUser({
      name: user.name,
      password: '',
      PhoneNumber: user.PhoneNumber,
      role: user.role
    });
    setEmail(user.email); 
    setIsEditMode(true);
    setShowModal(true);
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="main-content container mt-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Manage Users</h2>
              <button className="btn btn-primary mb-3" onClick={handleAddUser}><FaUserPlus style={{position:"relative",bottom:"2px"}} /> Add User</button>
              {loading ? <div className="alert alert-info">Loading...</div> : error ? <div className="alert alert-danger">{error}</div> : (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered table-striped">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Role</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.PhoneNumber}</td>
                          <td>{user.role}</td>
                          <td className="d-flex align-items-center justify-content-evenly">
                            <button  className="btn btn-warning btn-sm me-2 d-flex justify-content-center" style={{width:"100px"}} onClick={() => handleEdit(user)}><FontAwesomeIcon icon={faUserPen} style={{position:"relative",right:"10%",top:"2px"}} />  Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!loading && !error && Array.isArray(users) && users.length === 0 && <div className="alert alert-warning">No users found.</div>}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditMode ? 'Edit User' : 'Add New User'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {validationErrors && (
                  <div className="alert alert-danger">
                    {Object.keys(validationErrors).map((key) => (
                      <div key={key}>
                        {validationErrors[key].map((error) => (
                          <div key={error}>{error}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={newUser.name} onChange={handleInputChange} required />
                  </div>
                  {!isEditMode && (
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" className="form-control" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={newUser.password} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="PhoneNumber" className="form-label">Phone Number</label>
                    <input type="text" className="form-control" id="PhoneNumber" name="PhoneNumber" value={newUser.PhoneNumber} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select className="form-select" id="role" name="role" value={newUser.role} onChange={handleInputChange}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">{isEditMode ? 'Update User' : 'Add User'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
