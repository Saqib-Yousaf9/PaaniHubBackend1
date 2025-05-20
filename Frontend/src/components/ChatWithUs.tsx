import React, { Component } from "react";
import { FaTelegramPlane, FaRegCommentDots } from "react-icons/fa"; // Importing the icons

// Interface for chat state
interface ChatWithUsState {
  messages: { user: string; text: string }[];
  userMessage: string;
}

class ChatWithUs extends Component<{}, ChatWithUsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      messages: [],
      userMessage: "",
    };
  }

  // Function to get bot's response
  getBotResponse = (message: string): string => {
    const lowerCaseMessage = message.toLowerCase();

    // Respond to common queries
    if (
      lowerCaseMessage.includes("delivery") ||
      lowerCaseMessage.includes("order") ||
      lowerCaseMessage.includes("time")
    ) {
      return "The expected delivery time for your order is between 30 to 45 minutes depending on traffic and location. You can track your order status in the app.";
    } else if (
      lowerCaseMessage.includes("driver") &&
      lowerCaseMessage.includes("manipulate")
    ) {
      return "We take issues with drivers seriously. If you suspect the driver has manipulated your order, please report it to support immediately. We will investigate and take action.";
    } else if (
      lowerCaseMessage.includes("price") ||
      lowerCaseMessage.includes("plan")
    ) {
      return 'We offer competitive pricing plans based on your water needs. You can view all price plans on our website or in the app under "Pricing".';
    } else if (
      lowerCaseMessage.includes("cancel") ||
      lowerCaseMessage.includes("order cancel")
    ) {
      return 'You can cancel your order before it is dispatched from our warehouse. Go to "My Orders" in the app, select your order, and choose the cancel option. For more help, contact support.';
    } else if (
      lowerCaseMessage.includes("contact") ||
      lowerCaseMessage.includes("support")
    ) {
      return "You can contact our support team via email at support@example.com or call us at +123456789. We are available 24/7.";
    } else if (
      lowerCaseMessage.includes("driver") &&
      lowerCaseMessage.includes("behavior")
    ) {
      return "We are sorry to hear about any negative behavior from the driver. Please report it to our support team immediately so we can take appropriate action.";
    } else if (
      lowerCaseMessage.includes("water") &&
      lowerCaseMessage.includes("clean")
    ) {
      return "We apologize for the issue with the water quality. Please report this to support and we will make sure to address it with the highest priority. Quality assurance is our top priority.";
    } else {
      return "I am not sure about that. Can you please provide more details or rephrase your question? You can ask about order delivery, pricing, or support.";
    }
  };

  // Handle sending the user message
  handleSendMessage = () => {
    const { userMessage, messages } = this.state;

    if (userMessage.trim()) {
      // Add user message to the chat
      this.setState(
        {
          messages: [...messages, { user: "User", text: userMessage }],
          userMessage: "",
        },
        () => {
          // Generate bot response based on user query
          const botResponse = this.getBotResponse(userMessage);

          // Add bot response to the chat after a short delay
          setTimeout(() => {
            this.setState({
              messages: [
                ...this.state.messages,
                { user: "Bot", text: botResponse },
              ],
            });
          }, 1000);
        }
      );
    }
  };

  // Handle input change
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ userMessage: e.target.value });
  };

  render() {
    const { messages, userMessage } = this.state;

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
        <div className="w-full max-w-md bg-slate-200 rounded-lg shadow-lg p-6 animate__animated animate__fadeIn">
          <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">
            <FaRegCommentDots className="inline-block mr-2" /> Chat with Us
          </h2>

          {/* Chat Box */}
          <div className="chat-box mb-4 p-4 h-72 overflow-y-auto bg-gray-50 border border-gray-300 rounded-lg shadow-md">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  message.user === "User" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-3 rounded-lg text-white shadow-lg transition-all ${
                    message.user === "User"
                      ? "bg-blue-500 transform scale-105"
                      : "bg-gray-800 transform scale-105"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>

          {/* User Input and Send Button */}
          <div className="flex items-center mt-4">
            <input
              type="text"
              value={userMessage}
              onChange={this.handleInputChange}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Type your message..."
            />
            <button
              onClick={this.handleSendMessage}
              className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform active:scale-95"
            >
              <FaTelegramPlane className="inline-block text-xl" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatWithUs;
