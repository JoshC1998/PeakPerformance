import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Necessary for using Chart.js

function Tracker() {
  const [weight, setWeight] = useState('');
  const [lift, setLift] = useState('');
  const [liftsData, setLiftsData] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    const newEntry = {
      weight: parseFloat(weight),
      lift: parseFloat(lift),
      date: new Date().toLocaleDateString(),
    };

    setLiftsData([...liftsData, newEntry]);
    setWeight('');
    setLift('');
  }

  const data = {
    labels: liftsData.map(entry => entry.date),
    datasets: [
      {
        label: 'Weight',
        data: liftsData.map(entry => entry.weight),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Lift',
        data: liftsData.map(entry => entry.lift),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="tracker">
      <h2>Track Your Progress</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Weight (lbs):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
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
        <button type="submit">Submit</button>
      </form>
      {liftsData.length > 0 && (
        <div>
          <h3>Progress Graph</h3>
          <Line data={data} />
        </div>
      )}
    </div>
  );
}

export default Tracker;