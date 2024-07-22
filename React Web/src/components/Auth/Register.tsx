import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import { registerUser } from '../../features/auth/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateFields();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const userData: RegisterData = { name, email, password, phoneNumber: phoneNumber };
    console.log('Data being sent to API:', userData);
    const resultAction = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(resultAction)) {
      console.log('Registration successful:', resultAction.payload);
      const userRole = resultAction.payload.user.role;
      console.log('User role:', userRole);
      if (userRole === 'admin') {
        navigate('/admin-home');
      } else {
        navigate('/user-home');
      }
    } else {
      if (resultAction.payload) {
        console.error('Registration failed:', resultAction.payload);
      } else {
        console.error('Registration failed:', resultAction.error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group mb-3">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-danger">{errors.name}</p>}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-danger">{errors.email}</p>}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="text-danger">{errors.password}</p>}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setphoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber}</p>}
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </form>
              {status === 'loading' && <p className="text-center mt-3">Loading...</p>}
              {error && <p className="text-center text-danger mt-3">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
