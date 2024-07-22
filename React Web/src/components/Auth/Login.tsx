import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { loginUser } from '../../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../../App.css'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        const userRole = result.payload.user.role;
        console.log('Response JSON:', result.payload);
        console.log('User role:', userRole);

        if (userRole === 'admin') {
          navigate('/admin-home');
        } else {
          navigate('/user-home');
        }
      }
    });
  };

  useEffect(() => {
    if (status === 'succeeded' && user) {
      if (user.role === 'admin') {
        navigate('/admin-home');
      } else {
        navigate('/user-home');
      }
    }
  }, [status, user, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleSubmit} className="login-form mt-4">
          <div className="form-group mb-3">
          <FaEnvelope className="input-group-prepend" />  Email
            <div className="input-group">
              <div className="input-group-prepend">
                
              </div>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <FaLock  />  Password
            <div className="input-group">
              <div className="input-group-prepend">
              </div>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>
        {status === 'loading' && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        <p className="mt-3 text-center">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
