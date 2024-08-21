interface State {
  messages: any[];
}

class ActionProvider {
  constructor(private createChatBotMessage: (message: string) => any, private setState: (state: (prev: State) => State) => void) {}

  handleHello() {
    const message = this.createChatBotMessage("Hi there! How can I assist you?");
    this.setState((prev: State) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }

  handleHelp() {
    const message = this.createChatBotMessage("Sure! Here are some commands you can use: \n- Hello\n- Help");
    this.setState((prev: State) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }

  handleDefault() {
    const message = this.createChatBotMessage("Désolé, je n'ai pas compris votre message. Pouvez-vous le reformuler ?");
    this.setState((prev: State) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
  handleGoodbye() {
    const message = this.createChatBotMessage("Goodbye! Have a great day!");
    this.setState((prev: State) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
  handleThanks() {
    const message = this.createChatBotMessage("You're welcome! If you have any more questions, feel free to ask.");
    this.setState((prev: State) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
  handleWeather() {
    const message = this.createChatBotMessage("Please provide the name of the city to get the weather information.");
    this.setState((prev: State) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
  handleJoke() {
    const message = this.createChatBotMessage("Why don't scientists trust atoms? Because they make up everything!");
    this.setState((prev: State) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
  handleDateTime() {
    const now = new Date();
    const message = this.createChatBotMessage(`Current date and time is: ${now.toLocaleString()}`);
    this.setState((prev: State) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
  
  

  
  
  
}

export default ActionProvider;