import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5555';  // Replace with your actual API URL

function LeaderBoard({ currentUser }) {
  const [lifts, setLifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/lifts`)
      .then((res) => res.json())
      .then((data) => {
        // Sort the lifts by weight in descending order
        const sortedLifts = data.sort((a, b) => b.weight - a.weight);
        setLifts(sortedLifts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching lifts:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Leaderboard</h2>
      {lifts.length > 0 ? (
        <ul>
          {lifts.map((lift, index) => (
            <li key={index}>
              <p>
                <strong>{lift.user}</strong> - {lift.liftName}: {lift.weight} lbs
              </p>
              <video width="300" controls>
                <source src={lift.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </li>
          ))}
        </ul>
      ) : (
        <p>No lifts submitted yet.</p>
      )}
    </div>
  );
}

export default LeaderBoard;