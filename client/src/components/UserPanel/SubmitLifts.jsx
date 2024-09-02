import React, { useState } from 'react';

const API_URL = 'http://localhost:5555';  // Ensure you have the correct API_URL

function SubmitLift() {
  const [liftName, setLiftName] = useState('');
  const [weight, setWeight] = useState('');
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!video) {
      setMessage('Please upload a video.');
      return;
    }

    const fileSizeMB = video.size / 1024 / 1024;
    if (fileSizeMB > 50) {
      setMessage('File size exceeds the 50MB limit.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('video', video);

      const response = await fetch(`${API_URL}/upload`, {  // Update with correct upload endpoint
        method: 'POST',
        body: formData,
      });

      const textResponse = await response.text(); // Get raw text response
      console.log('Raw response:', textResponse); // Log the raw response

      if (response.ok) {
        const result = JSON.parse(textResponse); // Parse JSON only if response is okay
        submitLiftDetails(result.url);
      } else {
        setMessage('Failed to upload video.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setMessage('Error uploading video.');
      setLoading(false);
    }
  }

  function submitLiftDetails(videoUrl) {
    const liftData = {
      liftName,
      weight,
      videoUrl,
    };

    fetch(`${API_URL}/api/lifts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(liftData),
    })
      .then((res) => {
        if (res.ok) {
          setMessage('Lift submitted successfully!');
          setLiftName('');
          setWeight('');
          setVideo(null);
        } else {
          setMessage('Failed to submit lift.');
        }
      })
      .catch((error) => {
        console.error('Error submitting lift:', error);
        setMessage('Error submitting lift.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="submit-lift">
      <h2>Submit a New Lift</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Lift Type:
            <select
              value={liftName}
              onChange={(e) => setLiftName(e.target.value)}
              required
            >
              <option value="" disabled>Select a lift</option>
              <option value="Bench">Bench</option>
              <option value="Deadlift">Deadlift</option>
              <option value="Squat">Squat</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Weight (lbs):
            <input
              type="number"
              min="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Upload Video:
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Lift'}
        </button>
      </form>
    </div>
  );
}

export default SubmitLift;