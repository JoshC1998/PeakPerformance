import React, { useState } from 'react';
import '../design/Meals.css'; // Make sure to import the CSS file

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function Meals() {
  const [goal, setGoal] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [weightGoal, setWeightGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoalChange = (event) => {
    setGoal(event.target.value);
  };

  const handleCurrentWeightChange = (event) => {
    setCurrentWeight(event.target.value);
  };

  const handleWeightGoalChange = (event) => {
    setWeightGoal(event.target.value);
  };

  const handleActivityLevelChange = (event) => {
    setActivityLevel(event.target.value);
  };

  const fetchMealPlan = async () => {
    if (!goal || !currentWeight || !weightGoal || !activityLevel) return;

    setLoading(true);

    const prompt = `Act as a nutritionist and create a meal plan for someone who wants to ${goal}. Their current weight is ${currentWeight} lbs, and they want to achieve a target of ${weightGoal} lbs. The person is ${activityLevel} in their daily routine. Include breakfast, lunch, dinner, and snacks with specific foods and portions.`;

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
    <div className="meals-wrapper"> {/* New wrapper for the background */}
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

        <div className="weight-inputs">
          <label>
            Current Weight (lbs):
            <input
              type="number"
              value={currentWeight}
              onChange={handleCurrentWeightChange}
              placeholder="Enter your current weight"
            />
          </label>
          <label>
            Target Weight (lbs):
            <input
              type="number"
              value={weightGoal}
              onChange={handleWeightGoalChange}
              placeholder="Enter your target weight"
            />
          </label>
        </div>

        <div className="activity-level">
          <p>Activity Level:</p>
          <label>
            <input
              type="radio"
              value="sedentary"
              checked={activityLevel === 'sedentary'}
              onChange={handleActivityLevelChange}
            />
            Sedentary (little or no exercise)
          </label>
          <label>
            <input
              type="radio"
              value="light activity"
              checked={activityLevel === 'light activity'}
              onChange={handleActivityLevelChange}
            />
            Light Activity (light exercise 1-3 days per week)
          </label>
          <label>
            <input
              type="radio"
              value="moderate activity"
              checked={activityLevel === 'moderate activity'}
              onChange={handleActivityLevelChange}
            />
            Moderate Activity (moderate exercise 3-5 days per week)
          </label>
          <label>
            <input
              type="radio"
              value="very active"
              checked={activityLevel === 'very active'}
              onChange={handleActivityLevelChange}
            />
            Very Active (hard exercise 6-7 days per week)
          </label>
        </div>

        <button 
        className="meal-plan-button" 
        onClick={fetchMealPlan} disabled={loading || !goal || !currentWeight || !weightGoal || !activityLevel}>
          {loading ? 'Generating Meal Plan...' : 'Get Meal Plan'}
        </button>

        {mealPlan && (
          <div className="meal-plan">
            <h2>Your Meal Plan:</h2>
            <pre>{mealPlan}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default Meals;
