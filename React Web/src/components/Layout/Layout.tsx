import React from 'react';
import Navbar from '../Common/Navbar';
import UserSidebar from '../Common/UserSidebar';
import AdminSidebar from '../Common/AdminSidebar';
import 'bootstrap/dist/css/bootstrap.min.css'; 

interface LayoutProps {
  role: 'user' | 'admin';
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ role, children }) => {
  return (
    <div>
      <Navbar />
      <div className="d-flex">
        {role === 'admin' ? <AdminSidebar /> : <UserSidebar />}
        <div className="content flex-grow-1 p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
