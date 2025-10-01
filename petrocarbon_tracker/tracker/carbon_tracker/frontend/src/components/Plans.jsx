import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ user_id: '', plan_name: '', description: '', estimated_reduction: '' });
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/plans', newPlan);
      setNewPlan({ user_id: '', plan_name: '', description: '', estimated_reduction: '' });
      fetchPlans();
    } catch (error) {
      console.error('Erro ao criar plano:', error);
    }
  };

  const handleUpdatePlan = async (id) => {
    try {
      await axios.put(`/api/plans/${id}`, editingPlan);
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      await axios.delete(`/api/plans/${id}`);
      fetchPlans();
    } catch (error) {
      console.error('Erro ao deletar plano:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Gerenciamento de Planos de Redução de Carbono</h2>

      <div className="mb-8 p-4 border rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Criar Novo Plano</h3>
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div>
            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">ID do Usuário:</label>
            <input
              type="number"
              id="user_id"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newPlan.user_id}
              onChange={(e) => setNewPlan({ ...newPlan, user_id: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <label htmlFor="plan_name" className="block text-sm font-medium text-gray-700">Nome do Plano:</label>
            <input
              type="text"
              id="plan_name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newPlan.plan_name}
              onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição:</label>
            <textarea
              id="description"
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
            ></textarea>
          </div>
          <div>
            <label htmlFor="estimated_reduction" className="block text-sm font-medium text-gray-700">Redução Estimada (toneladas de CO2):</label>
            <input
              type="number"
              id="estimated_reduction"
              step="0.01"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={newPlan.estimated_reduction}
              onChange={(e) => setNewPlan({ ...newPlan, estimated_reduction: parseFloat(e.target.value) })}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Adicionar Plano
          </button>
        </form>
      </div>

      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Lista de Planos</h3>
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li key={plan.id} className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-gray-50">
              {editingPlan && editingPlan.id === plan.id ? (
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    value={editingPlan.plan_name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, plan_name: e.target.value })}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <textarea
                    value={editingPlan.description}
                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                  <input
                    type="number"
                    value={editingPlan.estimated_reduction}
                    onChange={(e) => setEditingPlan({ ...editingPlan, estimated_reduction: parseFloat(e.target.value) })}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingPlan.is_completed}
                      onChange={(e) => setEditingPlan({ ...editingPlan, is_completed: e.target.checked })}
                      className="form-checkbox"
                    />
                    <span>Concluído</span>
                  </label>
                  <button
                    onClick={() => handleUpdatePlan(plan.id)}
                    className="mr-2 py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingPlan(null)}
                    className="py-1 px-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex-grow">
                  <p className="font-semibold">{plan.plan_name} (Usuário ID: {plan.user_id})</p>
                  <p className="text-sm text-gray-600">Redução Estimada: {plan.estimated_reduction} tCO2</p>
                  <p className="text-sm text-gray-600">Status: {plan.is_completed ? 'Concluído' : 'Pendente'}</p>
                  {plan.description && <p className="text-xs text-gray-500 mt-1">{plan.description}</p>}
                </div>
              )}
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => setEditingPlan({ ...plan })}
                  className="py-1 px-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
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

export default Plans;

