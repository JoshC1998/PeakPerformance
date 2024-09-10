import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Necessary for using Chart.js

function Tracker() {
  const [weight, setWeight] = useState('');
  const [lift, setLift] = useState('');
  const [reps, setReps] = useState('');
  const [liftType, setLiftType] = useState('bench');
  const [liftsData, setLiftsData] = useState([]);
  const [filter, setFilter] = useState('all');

  function handleSubmit(e) {
    e.preventDefault();

    const newEntry = {
      weight: parseFloat(weight),
      lift: parseFloat(lift),
      reps: parseFloat(reps),
      liftType: liftType,
      date: new Date().toLocaleDateString(),
    };

    setLiftsData([...liftsData, newEntry]);
    setWeight('');
    setLift('');
    setReps('');
  }

  const filteredData = filter === 'all'
    ? liftsData
    : liftsData.filter(entry => entry.liftType === filter);

  // Function to create dataset for weight of each lift type
  const createLiftTypeDataset = (type, color) => ({
    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Weight (lbs)`,
    data: filteredData.filter(entry => entry.liftType === type).map(entry => ({
      x: entry.date,
      y: entry.lift,
    })),
    borderColor: color,
    borderWidth: 2,
    fill: false,
  });

  // Function to create dataset for body weight
  const createBodyWeightDataset = () => ({
    label: 'Body Weight (lbs)',
    data: filteredData.map(entry => ({
      x: entry.date,
      y: entry.weight,
    })),
    borderColor: 'rgba(75,192,192,1)',
    borderWidth: 2,
    fill: false,
  });

  // Function to create dataset for reps
  const createRepsDataset = () => ({
    label: 'Reps',
    data: filteredData.map(entry => ({
      x: entry.date,
      y: entry.reps,
    })),
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 2,
    fill: false,
  });

  const data = {
    labels: [...new Set(filteredData.map(entry => entry.date))],
    datasets: [
      createBodyWeightDataset(),
      createRepsDataset(),
      createLiftTypeDataset('bench', 'rgba(75,192,192,0.5)'),
      createLiftTypeDataset('deadlift', 'rgba(153,102,255,0.5)'),
      createLiftTypeDataset('squat', 'rgba(255,99,132,0.5)'),
    ].filter(dataset => dataset.data.length > 0),
  };

  return (
    <div className="tracker">
      <h2>Track Your Progress</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Lift Type:
            <select
              value={liftType}
              onChange={(e) => setLiftType(e.target.value)}
            >
              <option value="bench">Bench Press</option>
              <option value="deadlift">Deadlift</option>
              <option value="squat">Squat</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Lift (lbs):
            <input
              type="number"
              value={lift}
              onChange={(e) => setLift(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Reps:
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Body Weight (lbs):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        <label>
          Filter by Lift Type:
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="bench">Bench Press</option>
            <option value="deadlift">Deadlift</option>
            <option value="squat">Squat</option>
          </select>
        </label>
      </div>
      {filteredData.length > 0 && (
        <div>
          <h3>Progress Graph</h3>
          <Line data={data} />
        </div>
      )}
    </div>
  );
}

export default Tracker;