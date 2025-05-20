import React, { Component } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface State {
  name: string;
  email: string;
  message: string;
  faqs: FAQ[];
}

class DriverSupport extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
      faqs: [
        {
          question: "How do I become a driver?",
          answer:
            "You can apply to become a driver through our registration portal. Fill out the form, submit the necessary documents, and wait for approval.",
        },
        {
          question: "How do I track my earnings?",
          answer:
            "You can view your earnings through the driver dashboard. All completed trips and their respective payouts will be shown there.",
        },
        {
          question: "How do I get assistance with technical issues?",
          answer:
            'If you\'re facing technical issues, please use the "Contact Support" form below or check out the Help Center for troubleshooting guides.',
        },
      ],
    };
  }

  // Handle form changes
  handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = this.state;
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_SOCKET_URL || "http://localhost:3001"
        }/api/support/email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        }
      );
      if (res.ok) {
        alert("Your message has been sent! We'll get back to you shortly.");
        this.setState({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again later.");
      }
    } catch (err) {
      alert("Failed to send message. Please try again later.");
    }
  };

  render() {
    const { name, email, message, faqs } = this.state;

    return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Driver Support
        </h2>

        {/* Contact Form Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Support
          </h3>
          <form onSubmit={this.handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
                placeholder="Your Name"
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                placeholder="Your Email"
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <textarea
              name="message"
              value={message}
              onChange={this.handleChange}
              placeholder="Your Message"
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <h4 className="font-semibold text-gray-800">{faq.question}</h4>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Helpful Resources Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Helpful Resources
          </h3>
          <ul className="space-y-4">
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Driver Registration Guide
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Earnings and Payments FAQ
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Troubleshooting Common Issues
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Safety Tips for Drivers
              </a>
            </li>
          </ul>
        </div>

        {/* Live Chat (Optional) */}
        <div className="mt-8 bg-blue-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-700 mb-4">
            If you need help right now, feel free to reach out via our live chat
            support. We're here to help you 24/7.
          </p>
          <button
            onClick={() => alert("Live Chat feature is coming soon!")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Start Live Chat
          </button>
        </div>
      </div>
    );
  }
}

export default DriverSupport;
