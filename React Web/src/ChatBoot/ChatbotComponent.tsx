import React from 'react';
import Chatbot from 'react-chatbot-kit';
import config from './ChatbotConfig';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import './Chatbot.css'; 

const ChatbotComponent: React.FC = () => {
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Chatbot</div>
      <Chatbot 
        config={config} 
        messageParser={MessageParser} 
        actionProvider={ActionProvider} 
      />
    </div>
  );
};

export default ChatbotComponent;
