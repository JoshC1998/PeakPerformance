import React, { useState } from 'react';
import '../design/Workouts.css'; // Ensure this path is correct

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // Use your API key from environment variables

function Workouts() {
  const [goal, setGoal] = useState('');
  const [detail, setDetail] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');

  const handleGoalChange = (event) => {
    setGoal(event.target.value);
    setDetail(''); // Reset detail when goal changes
  };

  const handleDetailChange = (event) => {
    setDetail(event.target.value);
  };

  const handlePromptChange = (event) => {
    setUserPrompt(event.target.value);
  };

  const handleCurrentWeightChange = (event) => {
    setCurrentWeight(event.target.value);
  };

  const handleTargetWeightChange = (event) => {
    setTargetWeight(event.target.value);
  };

  const fetchWorkoutPlan = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,  // Use environment variable here
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a personal trainer."
            },
            {
              role: "user",
              content: userPrompt || `Create a detailed workout plan for someone aiming for ${goal}. Focus on ${detail || 'a general workout'}. Their current weight is ${currentWeight} lbs and their target weight is ${targetWeight} lbs.`
            }
          ],
          max_tokens: 200,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          setPlan(data.choices[0].message.content.trim());
        } else {
          setError('No plan generated. Please try again.');
        }
      } else if (response.status === 429) {
        setError('Quota exceeded. Please check your plan and billing details.');
        console.error('Quota exceeded:', await response.text());
      } else {
        setError('Failed to fetch workout plan');
        console.error('Failed response:', await response.text());
      }
    } catch (error) {
      setError('Error fetching workout plan');
      console.error('Error fetching workout plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (goal || userPrompt) {
      fetchWorkoutPlan();
    } else {
      setError('Please enter a prompt or select a goal');
    }
  };

  return (
    <div className="workouts-wrapper">
      <div className="workouts-container">
        <h5>Workout Plans</h5>
        <form onSubmit={handleSubmit}>
          <label>
            Choose your goal:
            <select value={goal} onChange={handleGoalChange} disabled={loading}>
              <option value="">Select a goal</option>
              <option value="weight loss">Weight Loss</option>
              <option value="weight gain">Weight Gain</option>
              <option value="strength">Strength</option>
            </select>
          </label>

          {goal && (
            <label>
              Choose a detail:
              <select value={detail} onChange={handleDetailChange} disabled={loading}>
                <option value="">Select a detail</option>
                {goal === 'weight loss' && (
                  <>
                    <option value="fat loss">Fat Loss</option>
                    <option value="toning">Toning</option>
                  </>
                )}
                {goal === 'weight gain' && (
                  <>
                    <option value="muscle gain">Muscle Gain</option>
                    <option value="bulk">Bulking</option>
                  </>
                )}
                {goal === 'strength' && (
                  <>
                    <option value="powerlifting">Powerlifting</option>
                    <option value="general strength">General Strength</option>
                  </>
                )}
              </select>
            </label>
          )}

          <label>
            Or type your own prompt:
            <textarea
              value={userPrompt}
              onChange={handlePromptChange}
              disabled={loading}
              placeholder="Type your custom workout prompt here..."
            />
          </label>

          <label>
            Current weight (lbs):
            <input
              type="number"
              value={currentWeight}
              onChange={handleCurrentWeightChange}
              disabled={loading}
              placeholder="Enter your current weight"
            />
          </label>

          <label>
            Target weight (lbs):
            <input
              type="number"
              value={targetWeight}
              onChange={handleTargetWeightChange}
              disabled={loading}
              placeholder="Enter your target weight"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Get Workout Plan'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <p>Loading your workout plan...</p>
          </div>
        )}

        {plan && (
          <div className="plan-container">
            <h2 className="plan-header">Your Workout Plan:</h2>
            <p className="plan-content">{plan}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
