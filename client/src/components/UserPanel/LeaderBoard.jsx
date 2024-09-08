import React from 'react';

const LeaderBoard = ({ liftData }) => {
  const getSortedLifts = (lifts) => {
    return lifts.sort((a, b) => b.weight - a.weight); // Sort in descending order by weight
  };

  const benchPressData = getSortedLifts(liftData.filter(lift => lift.liftName.toLowerCase() === 'bench'));
  const deadliftData = getSortedLifts(liftData.filter(lift => lift.liftName.toLowerCase() === 'deadlift'));
  const squatData = getSortedLifts(liftData.filter(lift => lift.liftName.toLowerCase() === 'squat'));

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>

      <h2>Bench Press</h2>
      <ul>
        {benchPressData.map((lift, index) => (
          <li key={index}>
            {lift.user}: {lift.weight} lbs <a href={lift.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
          </li>
        ))}
      </ul>

      <h2>Deadlift</h2>
      <ul>
        {deadliftData.map((lift, index) => (
          <li key={index}>
            {lift.user}: {lift.weight} lbs <a href={lift.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
          </li>
        ))}
      </ul>

      <h2>Squat</h2>
      <ul>
        {squatData.map((lift, index) => (
          <li key={index}>
            {lift.user}: {lift.weight} lbs <a href={lift.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;