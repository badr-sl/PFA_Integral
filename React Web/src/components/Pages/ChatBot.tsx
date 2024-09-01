import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import ChatbotComponent from '../../ChatBoot/ChatbotComponent';
import Layout from '../Layout/Layout'; 

const ChatBot: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role); 

  return (
    <Layout role={userRole || 'user'}>
      <div>
        <ChatbotComponent />
      </div>
    </Layout>
  );
}

export default ChatBot;
