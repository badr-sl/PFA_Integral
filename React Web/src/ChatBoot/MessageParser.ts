interface ActionProvider {
  handleHello: () => void;
  handleHelp: () => void;
  handleDefault: () => void;
  handleGoodbye: () => void;
  handleThanks: () => void;
  handleWeather: () => void;
  handleJoke: () => void;
  handleDateTime: () => void;
}

class MessageParser {
  constructor(private actionProvider: ActionProvider) {}

  parse(message: string) {
    const lowerCaseMessage = message.toLowerCase();
  
    if (lowerCaseMessage.includes("hello")) {
      this.actionProvider.handleHello();
    } else if (lowerCaseMessage.includes("help")) {
      this.actionProvider.handleHelp();
    } else if (lowerCaseMessage.includes("goodbye") || lowerCaseMessage.includes("au revoir")) {
      this.actionProvider.handleGoodbye();
    } else if (lowerCaseMessage.includes("thanks") || lowerCaseMessage.includes("merci")) {
      this.actionProvider.handleThanks();
    } else if (lowerCaseMessage.includes("weather") || lowerCaseMessage.includes("météo")) {
      this.actionProvider.handleWeather();
    } else if (lowerCaseMessage.includes("joke") || lowerCaseMessage.includes("blague")) {
      this.actionProvider.handleJoke();
    } else if (lowerCaseMessage.includes("date") || lowerCaseMessage.includes("time") || lowerCaseMessage.includes("heure")) {
      this.actionProvider.handleDateTime();
    } else {
      this.actionProvider.handleDefault();
    }
  }
  
}

export default MessageParser;