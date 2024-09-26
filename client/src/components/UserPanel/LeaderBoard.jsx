import React, { useState } from 'react';
import '../design/LeaderBoard.css'; // We'll create a CSS file for styles

const LeaderBoard = ({ liftData }) => {
  const [activeTab, setActiveTab] = useState('bench'); // Set default tab

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
  const pushUpsData = rankLifts(getSortedLifts(liftData.filter(lift => lift.liftName.toLowerCase() === 'push-ups')));
  const pullUpsData = rankLifts(getSortedLifts(liftData.filter(lift => lift.liftName.toLowerCase() === 'pull-ups')));

  const renderLiftList = (data) => (
    <div className="lift-list">
      {data.map((lift, index) => (
        <div key={index} className="lift-item">
          <span>Rank {lift.rank}: {lift.user}</span>
          <span>{lift.weight ? `${lift.weight} lbs` : lift.reps ? `${lift.reps} reps` : 'N/A'}</span>
          <a href={lift.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bench':
        return renderLiftList(benchPressData);
      case 'deadlift':
        return renderLiftList(deadliftData);
      case 'squat':
        return renderLiftList(squatData);
      case 'push-ups':
        return renderLiftList(pushUpsData);
      case 'pull-ups':
        return renderLiftList(pullUpsData);
      default:
        return null;
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <div className="tabs">
          <button className={activeTab === 'bench' ? 'active' : ''} onClick={() => setActiveTab('bench')}>Bench Press</button>
          <button className={activeTab === 'deadlift' ? 'active' : ''} onClick={() => setActiveTab('deadlift')}>Deadlift</button>
          <button className={activeTab === 'squat' ? 'active' : ''} onClick={() => setActiveTab('squat')}>Squat</button>
          <button className={activeTab === 'push-ups' ? 'active' : ''} onClick={() => setActiveTab('push-ups')}>Push-Ups</button>
          <button className={activeTab === 'pull-ups' ? 'active' : ''} onClick={() => setActiveTab('pull-ups')}>Pull-Ups</button>
        </div>
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;