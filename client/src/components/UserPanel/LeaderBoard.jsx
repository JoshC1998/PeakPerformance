import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5555'; 

function LeaderBoard() {
  const [lifts, setLifts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/lifts`)
      .then((res) => res.json())
      .then((data) => {
        setLifts(data);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard:', error);
      });
  }, []);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {lifts.length > 0 ? (
        <ul>
          {lifts.map((lift, index) => (
            <li key={index}>
              {index + 1}. {lift.lift_name} - {lift.weight} lbs
              <video width="300" controls>
                <source src={lift.video_url} type="video/mp4" />
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