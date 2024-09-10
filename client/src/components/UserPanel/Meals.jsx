import React, { useState } from 'react';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function Meals() {
  const [goal, setGoal] = useState('');
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoalChange = (event) => {
    setGoal(event.target.value);
  };

  const fetchMealPlan = async () => {
    if (!goal) return;
    
    setLoading(true);

    const prompt = `Act as a nutritionist and create a meal plan for someone who wants to ${goal}. Include breakfast, lunch, dinner, and snacks with specific foods and portions.`;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4", 
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      setMealPlan(data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meals-container">
      <h1>Meal Plan Generator</h1>
      <p>Select your goal:</p>
      <div className="goal-selection">
        <label>
          <input
            type="radio"
            value="bulk"
            checked={goal === 'bulk'}
            onChange={handleGoalChange}
          />
          Bulk
        </label>
        <label>
          <input
            type="radio"
            value="cut"
            checked={goal === 'cut'}
            onChange={handleGoalChange}
          />
          Cut
        </label>
        <label>
          <input
            type="radio"
            value="maintain"
            checked={goal === 'maintain'}
            onChange={handleGoalChange}
          />
          Maintain
        </label>
      </div>

      <button onClick={fetchMealPlan} disabled={loading || !goal}>
        {loading ? 'Generating Meal Plan...' : 'Get Meal Plan'}
      </button>

      {mealPlan && (
        <div className="meal-plan">
          <h2>Your Meal Plan:</h2>
          <pre>{mealPlan}</pre>
        </div>
      )}
    </div>
  );
}

export default Meals;