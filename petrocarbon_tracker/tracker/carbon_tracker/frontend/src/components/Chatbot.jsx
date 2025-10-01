import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // This endpoint will be implemented in a later phase for AI suggestions
      const response = await axios.post('/api/chatbot', { message: message });
      const botMessage = { sender: 'bot', text: response.data.reply };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem para o chatbot:', error);
      setChatHistory((prev) => [...prev, { sender: 'bot', text: 'Desculpe, não consegui processar sua solicitação no momento.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md p-4">
      <h2 className="text-3xl font-bold mb-4">Chatbot de Sugestões de Redução de Carbono</h2>
      <div className="flex-grow overflow-y-auto border rounded-md p-4 mb-4 bg-gray-50">
        {chatHistory.length === 0 ? (
          <p className="text-gray-500">Olá! Como posso ajudar você a reduzir sua pegada de carbono hoje?</p>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                {msg.text}
              </span>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-center text-gray-500">
            Digitando...
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chatbot;

