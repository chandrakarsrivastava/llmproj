import React, { useState, useRef, useEffect } from 'react';
import './PSDBChat.css';

const PSDBChat = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hi! How can I help you with the PSDB Service today?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: input }
    ]);
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "🤖 I'm a demo bot. Your query was: " + input }
      ]);
    }, 800);
    setInput('');
  };

  return (
    <div className="psdb-chat-outer-wrapper">
      <div className="psdb-chat-container">
        <div className="psdb-chat-header">
          <span role="img" aria-label="chat">💬</span> PSDB Service Chat
        </div>
        <div className="psdb-chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`psdb-chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form className="psdb-chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="psdb-chat-input"
            placeholder="Type your message and press Enter..."
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button className="psdb-chat-send-btn" type="submit" aria-label="Send">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M3 20v-6l13-2-13-2V4l18 8-18 8z" fill="currentColor"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PSDBChat;