import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  botName: "PedroChatBot",
  initialMessages: [
    createChatBotMessage("Hello! How can I help you today?", {
      widget: "default",
      delay: 5,
    }),
  ],

};

export default config;
