import React, { useState, useEffect } from 'react';

function Scoreboard() {
  const [scoreboardData, setScoreboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/scoreboard`)
      .then(res => res.json())
      .then(data => {
        setScoreboardData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching scoreboard data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h1>Loading scoreboard...</h1>;
  }

  return (
    <div>
      <h2>Scoreboard</h2>
      <ul>
        {scoreboardData.map((entry, index) => (
          <li key={index}>{entry.name}: {entry.lift} lbs</li>
        ))}
      </ul>
    </div>
  );
}

export default Scoreboard;