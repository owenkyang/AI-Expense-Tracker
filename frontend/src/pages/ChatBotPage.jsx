import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query';


const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you with your finances today?' },
  ]);
  const [input, setInput] = useState('');
  const{data:authUser} = useQuery(GET_AUTHENTICATED_USER)
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:5000/financial_advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input, user_id: authUser?.authUser?._id }),
      });

      const data = await response.json();
      setMessages([...newMessages, { sender: 'bot', text: data.response }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages([...newMessages, { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    
      <div className="flex flex-col h-[770px] w-[1000px] mx-auto bg-white shadow-lg rounded-xl">
      <div className="flex-1 overflow-y-auto p-2">
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
      <div className="flex p-4 bg-black">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 text-black rounded-lg"
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
