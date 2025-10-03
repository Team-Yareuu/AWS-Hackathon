import React, { useState, useEffect } from 'react';
import { recipeAPI, healthCheck } from '../../services/api';
import Button from '../../components/ui/Button';

const APITestPage = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test health check on component mount
  useEffect(() => {
    testHealthCheck();
  }, []);

  const testHealthCheck = async () => {
    try {
      const status = await healthCheck();
      setHealthStatus(status);
      console.log('✅ Backend health check:', status);
    } catch (err) {
      setError('Backend server is not reachable');
      console.error('❌ Backend health check failed:', err);
    }
  };

  const testGetAllRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeAPI.getAll(0, 10);
      setRecipes(data);
      console.log('✅ Fetched recipes:', data);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error('❌ Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const testGetRecipeById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeAPI.getById(id);
      setSelectedRecipe(data);
      console.log('✅ Fetched recipe by ID:', data);
    } catch (err) {
      setError(`Failed to fetch recipe ${id}`);
      console.error('❌ Failed to fetch recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">API Connection Test</h1>

        {/* Backend Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Backend Status</h2>
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${healthStatus ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-lg">
              {healthStatus ? (
                <span className="text-green-600">✅ Connected - {healthStatus.message}</span>
              ) : (
                <span className="text-red-600">❌ Disconnected</span>
              )}
            </span>
          </div>
          <div className="mt-4">
            <Button onClick={testHealthCheck} variant="outline">
              Refresh Status
            </Button>
          </div>
        </div>

        {/* Recipes Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Recipe API Test</h2>
          
          <div className="flex gap-4 mb-6">
            <Button onClick={testGetAllRecipes} disabled={loading}>
              {loading ? 'Loading...' : 'Get All Recipes'}
            </Button>
            <Button onClick={() => testGetRecipeById('1')} disabled={loading} variant="outline">
              Get Recipe ID: 1
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Display All Recipes */}
          {recipes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">All Recipes ({recipes.length})</h3>
              <div className="grid gap-4">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{recipe.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">{recipe.shortDescription}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>📍 {recipe.region}</span>
                          <span>⏱️ {recipe.cookingTimeMinutes} minutes</span>
                          <span>💰 Rp {recipe.estimatedCost?.toLocaleString()}</span>
                          <span>👥 {recipe.servings} servings</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => testGetRecipeById(recipe.id)}
                        size="sm"
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display Selected Recipe Details */}
          {selectedRecipe && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Recipe Details</h3>
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-2xl mb-2">{selectedRecipe.name}</h4>
                    <p className="text-gray-600 mb-4">{selectedRecipe.shortDescription}</p>
                    
                    <div className="space-y-2">
                      <p><strong>ID:</strong> {selectedRecipe.id}</p>
                      <p><strong>Region:</strong> {selectedRecipe.region}</p>
                      <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
                      <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTimeMinutes} minutes</p>
                      <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
                      <p><strong>Estimated Cost:</strong> Rp {selectedRecipe.estimatedCost?.toLocaleString()}</p>
                      <p><strong>Traditional:</strong> {selectedRecipe.isTraditional ? 'Yes' : 'No'}</p>
                      <p><strong>New Recipe:</strong> {selectedRecipe.isNew ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  {selectedRecipe.image && (
                    <div>
                      <img 
                        src={selectedRecipe.image} 
                        alt={selectedRecipe.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* JSON Preview */}
                <details className="mt-6">
                  <summary className="cursor-pointer font-semibold mb-2">View JSON Response</summary>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto text-xs">
                    {JSON.stringify(selectedRecipe, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* API Endpoints Documentation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Available API Endpoints</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="p-3 bg-gray-100 rounded">
              <span className="text-green-600 font-bold">GET</span> http://localhost:8000/api/v1/recipes/
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <span className="text-green-600 font-bold">GET</span> http://localhost:8000/api/v1/recipes/:id
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <span className="text-blue-600 font-bold">POST</span> http://localhost:8000/api/v1/recipes/
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <span className="text-blue-600 font-bold">POST</span> http://localhost:8000/api/v1/ai/search
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <span className="text-blue-600 font-bold">POST</span> http://localhost:8000/api/v1/ai/assistant
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <span className="text-blue-600 font-bold">POST</span> http://localhost:8000/api/v1/users/register
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <span className="text-blue-600 font-bold">POST</span> http://localhost:8000/api/v1/users/token
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITestPage;

