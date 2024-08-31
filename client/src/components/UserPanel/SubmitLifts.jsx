import React, { useState } from 'react';

function SubmitLift({ search }) {
  const [liftName, setLiftName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const newLift = {
      liftName,
      weight,
      reps,
      notes,
    };

    // You can adjust the endpoint as needed
    fetch('/api/lifts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLift),
    })
      .then((res) => {
        if (res.ok) {
          setMessage('Lift submitted successfully!');
          // Reset the form
          setLiftName('');
          setWeight('');
          setReps('');
          setNotes('');
        } else {
          setMessage('Failed to submit lift.');
        }
      })
      .catch((error) => {
        console.error('Error submitting lift:', error);
        setMessage('Error submitting lift.');
      });
  }

  return (
    <div className="submit-lift">
      <h2>Submit a New Lift</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Lift Name:
            <input
              type="text"
              value={liftName}
              onChange={(e) => setLiftName(e.target.value)}
              required
            />
          </label>
        </div>
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
            Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Submit Lift</button>
      </form>
    </div>
  );
}

export default SubmitLift;