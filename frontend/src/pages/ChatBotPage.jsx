import React, { useState } from 'react';


const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you with your finances today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to the chat
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    // Clear the input field
    setInput('');

    // Send user's message to the backend API and get the response
    try {
      const response = await fetch('http://127.0.0.1:5000/get_advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages([...newMessages, { sender: 'bot', text: data.advice }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages([...newMessages, { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 rounded-lg max-w-xs${
              msg.sender === 'bot' ? 'bg-blue-200 self-start' : 'bg-green-200 self-end'
            }`}
          >
            <p className='text-black'>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex p-4 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
