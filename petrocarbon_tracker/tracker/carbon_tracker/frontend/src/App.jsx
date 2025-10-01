import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

// Importe seus componentes aqui
import Home from './components/Home';
import Users from './components/Users';
import Plans from './components/Plans';
import Ranking from './components/Ranking';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="bg-gray-800 p-4 text-white">
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/users" className="hover:text-gray-300">Usuários</Link></li>
            <li><Link to="/plans" className="hover:text-gray-300">Planos de Redução</Link></li>
            <li><Link to="/ranking" className="hover:text-gray-300">Ranking</Link></li>
            <li><Link to="/chatbot" className="hover:text-gray-300">Chatbot IA</Link></li>
          </ul>
        </nav>

        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

