import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import UserHome from './components/Pages/UserHome';
import AdminHome from './components/Pages/AdminHome';
import ManageTasks from './components/Pages/ManageTasks';
import ManageUsers from './components/Pages/ManageUsers';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Profile from './components/Pages/Profile';
import Tasks from './components/Pages/Tasks';
import UserTasks from './components/Pages/UserTasks';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin-home" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/UserTasks"element={<UserTasks />} />

          <Route
            path="/user-home"
            element={
              <ProtectedRoute element={<UserHome />} roles={['user', 'admin']} />
            }
          />
          <Route
            path="/admin-home"
            element={<ProtectedRoute element={<AdminHome />} roles={['admin']} />}
          />
          <Route
            path="/tasks"
            element={<ProtectedRoute element={<ManageTasks />} roles={['admin']} />}
          />
          <Route
            path="/manage-tasks"
            element={<ProtectedRoute element={<ManageTasks />} roles={['admin']} />}
          />
          <Route
            path="/manage-users"
            element={<ProtectedRoute element={<ManageUsers />} roles={['admin']} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
