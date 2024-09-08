import React from 'react';

const LeaderBoard = ({ liftData }) => {
  const getSortedLifts = (lifts) => {
    return lifts.sort((a, b) => b.weight - a.weight); // Sort in descending order by weight
  };

  const rankLifts = (lifts) => {
    const rankedLifts = [];
    let currentRank = 1;
    let lastWeight = null;
    let lastRank = 1;

    lifts.forEach((lift) => {
      if (lift.weight === lastWeight) {
        rankedLifts.push({ ...lift, rank: lastRank });
      } else {
        lastRank = currentRank;
        rankedLifts.push({ ...lift, rank: currentRank });
        lastWeight = lift.weight;
      }
      currentRank++;
    });

    return rankedLifts;
  };

  const benchPressData = rankLifts(getSortedLifts(liftData.filter(lift => lift.liftName.toLowerCase() === 'bench')));
  const deadliftData = rankLifts(getSortedLifts(liftData.filter(lift => lift.liftName.toLowerCase() === 'deadlift')));
  const squatData = rankLifts(getSortedLifts(liftData.filter(lift => lift.liftName.toLowerCase() === 'squat')));

  const renderLiftList = (data) => (
    <div>
      {data.map((lift, index) => (
        <div key={index}>
          Rank {lift.rank}: {lift.user} - {lift.weight} lbs <a href={lift.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
        </div>
      ))}
    </div>
  );

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>

      <h2>Bench Press</h2>
      {renderLiftList(benchPressData)}

      <h2>Deadlift</h2>
      {renderLiftList(deadliftData)}

      <h2>Squat</h2>
      {renderLiftList(squatData)}
    </div>
  );
};

export default LeaderBoard;
