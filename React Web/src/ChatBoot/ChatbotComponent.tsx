
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './ChatbotConfig';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import './Chatbot.css';



const ChatbotComponent = () => {
  return (
    <div className='globale'>
      <div className="chatbot-container">
      <div className="chatbot-header">Chatbot Assistant</div>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
    </div>
    
  );
};

export default ChatbotComponent;