import React, { useState } from 'react';

function Workouts() {
  const [goal, setGoal] = useState('');
  const [detail, setDetail] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoalChange = (event) => {
    setGoal(event.target.value);
    setDetail(''); // Reset detail when goal changes
  };

  const handleDetailChange = (event) => {
    setDetail(event.target.value);
  };

  const fetchWorkoutPlan = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",  // Updated to the current model
          messages: [
            {
              role: "system",
              content: "You are a personal trainer."
            },
            {
              role: "user",
              content: `Create a detailed workout plan for someone aiming for ${goal}. Focus on ${detail}.`
            }
          ],
          max_tokens: 150, // Adjust as needed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          setPlan(data.choices[0].message.content.trim());
        } else {
          setError('No plan generated. Please try again.');
        }
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
    if (goal && detail) {
      fetchWorkoutPlan();
    } else {
      setError('Please select both a goal and a detail');
    }
  };

  return (
    <div>
      <h1>Workout Plans</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Choose your goal:
          <select value={goal} onChange={handleGoalChange}>
            <option value="">Select a goal</option>
            <option value="weight loss">Weight Loss</option>
            <option value="weight gain">Weight Gain</option>
            <option value="strength">Strength</option>
          </select>
        </label>
        {goal && (
          <label>
            Choose a detail:
            <select value={detail} onChange={handleDetailChange}>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Workout Plan'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {plan && <div>
        <h2>Your Workout Plan:</h2>
        <p>{plan}</p>
      </div>}
    </div>
  );
}

export default Workouts;