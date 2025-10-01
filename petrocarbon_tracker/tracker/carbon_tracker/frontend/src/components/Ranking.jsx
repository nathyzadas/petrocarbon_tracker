import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const response = await axios.get('/api/ranking');
      setRanking(response.data);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Ranking de Redução de Carbono</h2>
      <div className="p-4 border rounded-lg shadow-md">
        <ul className="space-y-2">
          {ranking.length > 0 ? (
            ranking.map((user, index) => (
              <li key={user.id} className="flex justify-between items-center p-3 border rounded-md bg-white">
                <span className="font-semibold text-lg">{index + 1}. {user.username}</span>
                <span className="text-blue-600 font-bold">{user.points} Pontos</span>
              </li>
            ))
          ) : (
            <p>Nenhum usuário no ranking ainda.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Ranking;

