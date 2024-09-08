import React, { useState, useEffect } from 'react';

const LeaderBoard = ({ liftData }) => {
  const [benchPressData, setBenchPressData] = useState([]);
  const [deadliftData, setDeadliftData] = useState([]);
  const [squatData, setSquatData] = useState([]);

  useEffect(() => {
    if (liftData) {
      const sortedBenchPress = liftData
        .filter(lift => lift.liftName.toLowerCase() === 'bench')
        .sort((a, b) => b.weight - a.weight); // Sort by weight, descending

      const sortedDeadlift = liftData
        .filter(lift => lift.liftName.toLowerCase() === 'deadlift')
        .sort((a, b) => b.weight - a.weight);

      const sortedSquat = liftData
        .filter(lift => lift.liftName.toLowerCase() === 'squat')
        .sort((a, b) => b.weight - a.weight);

      setBenchPressData(sortedBenchPress);
      setDeadliftData(sortedDeadlift);
      setSquatData(sortedSquat);
    }
  }, [liftData]);

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>

      <h2>Bench Press</h2>
      <ul>
        {benchPressData.map((lift, index) => (
          <li key={index}>
            {lift.user}: {lift.weight} lbs - 
            <a href={lift.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
          </li>
        ))}
      </ul>

      <h2>Deadlift</h2>
      <ul>
        {deadliftData.map((lift, index) => (
          <li key={index}>
            {lift.user}: {lift.weight} lbs - 
            <a href={lift.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
          </li>
        ))}
      </ul>

      <h2>Squat</h2>
      <ul>
        {squatData.map((lift, index) => (
          <li key={index}>
            {lift.user}: {lift.weight} lbs - 
            <a href={lift.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;