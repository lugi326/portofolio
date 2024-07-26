import React, { useState } from 'react';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, sessionId: 'your-session-id' })
    });
    const data = await response.json();
    setMessages([...messages, { text: input, from: 'user' }, { text: data.response, from: 'bot' }]);
    setInput('');
  };

  return (
    <div>
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={msg.from}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbox;