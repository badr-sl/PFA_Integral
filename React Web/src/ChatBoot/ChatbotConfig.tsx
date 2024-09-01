import { createChatBotMessage } from 'react-chatbot-kit';
import { BotAvatar } from './BotAvatar';
import { JSX } from 'react/jsx-runtime';

const config = {
  botName: "AssistantBot",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#f0f0f0",
    },
    chatButton: {
      backgroundColor: "#4a90e2",
    },
  },
  customComponents: {
    botAvatar: (props: JSX.IntrinsicAttributes) => <BotAvatar {...props} />,
  },
  initialMessages: [
    createChatBotMessage("Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?", {
      delay: 500,
      widget: "options",
    }),
  ],
  widgets: [
    {
      widgetName: "options",
      widgetFunc: (props: { actionProvider: { handleHelp: () => void; handleWeather: () => void; handleJoke: () => void; handleDateTime: () => void; }; }) => (
        <div className="chatbot-options">
          <button onClick={() => props.actionProvider.handleHelp()} className="chatbot-option-button">Aide</button>
          <button onClick={() => props.actionProvider.handleWeather()} className="chatbot-option-button">Météo</button>
          <button onClick={() => props.actionProvider.handleJoke()} className="chatbot-option-button">Blague</button>
          <button onClick={() => props.actionProvider.handleDateTime()} className="chatbot-option-button">Date et heure</button>
        </div>
      ),
    },
  ],
};

export default config;