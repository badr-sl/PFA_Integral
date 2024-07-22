import React from 'react';
import Layout from '../Layout/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const AdminHome: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <Layout role="admin">
      <h1>Admin Home</h1>
      <p>Welcome, {user.name}!</p>
    </Layout>
  );
};

export default AdminHome;
