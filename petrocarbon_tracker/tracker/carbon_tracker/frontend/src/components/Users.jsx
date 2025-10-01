import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', newUser);
      setNewUser({ username: '', email: '' });
      fetchUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      await axios.put(`/api/users/${id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Gerenciamento de Usuários</h2>

      <div className="mb-8 p-4 border rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Criar Novo Usuário</h3>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário:</label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Adicionar Usuário
          </button>
        </form>
      </div>

      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Lista de Usuários</h3>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-gray-50">
              {editingUser && editingUser.id === user.id ? (
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    value={editingUser.carbon_footprint}
                    onChange={(e) => setEditingUser({ ...editingUser, carbon_footprint: parseFloat(e.target.value) })}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    value={editingUser.points}
                    onChange={(e) => setEditingUser({ ...editingUser, points: parseInt(e.target.value) })}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => handleUpdateUser(user.id)}
                    className="mr-2 py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="py-1 px-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex-grow">
                  <p className="font-semibold">{user.username} ({user.email})</p>
                  <p className="text-sm text-gray-600">Pegada de Carbono: {user.carbon_footprint} | Pontos: {user.points}</p>
                </div>
              )}
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => setEditingUser({ ...user })}
                  className="py-1 px-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Users;

