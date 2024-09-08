import React, { useState, useEffect } from 'react';

const LeaderBoard = ({ liftData }) => {
  const [benchPressData, setBenchPressData] = useState([]);
  const [deadliftData, setDeadliftData] = useState([]);
  const [squatData, setSquatData] = useState([]);

  useEffect(() => {
    if (liftData) {
      setBenchPressData(liftData.filter(lift => lift.liftName.toLowerCase() === 'bench'));
      setDeadliftData(liftData.filter(lift => lift.liftName.toLowerCase() === 'deadlift'));
      setSquatData(liftData.filter(lift => lift.liftName.toLowerCase() === 'squat'));
    }
  }, [liftData]);

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>

      <h2>Bench Press</h2>
      <ul>
        {benchPressData.map((lift, index) => (
          <li key={index}>
            {lift.user}: {lift.weight} lbs
          </li>
        ))}
      </ul>

      <h2>Deadlift</h2>
      <ul>
        {deadliftData.map((lift, index) => (
          <li key={index}>
            {lift.user}: {lift.weight} lbs
          </li>
        ))}
      </ul>

      <h2>Squat</h2>
      <ul>
        {squatData.map((lift, index) => (
          <li key={index}>
            {lift.user}: {lift.weight} lbs
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;