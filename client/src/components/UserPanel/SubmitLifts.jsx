import React, { useState } from 'react';
import { useVideo } from './VideoContext'; 

const API_URL = 'http://localhost:5555'; 

function SubmitLift({ currentUser, onLiftSubmitted }) {
  const { submittedVideos, setSubmittedVideos } = useVideo(); 
  const [liftName, setLiftName] = useState('');
  const [weight, setWeight] = useState('');
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleVideoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  }

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

      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload video.');
      }

      const uploadResult = await uploadResponse.json();
      setMessage('Video uploaded successfully!');
      submitLiftDetails(uploadResult.url);
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
      user: currentUser.username,
    };

    fetch(`${API_URL}/api/lifts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(liftData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage('Lift submitted successfully!');
          onLiftSubmitted(); // Refresh the lift data in parent
          const newLift = {
            user: currentUser.username,
            type: liftName,
            weight: weight,
            videoUrl: videoUrl,
            reps: 1,
          };

          setSubmittedVideos(prev => [...prev, newLift]);

          setLiftName('');
          setWeight('');
          setVideo(null);
          setVideoPreview('');
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
              onChange={handleVideoChange}
              required
            />
          </label>
        </div>
        {videoPreview && (
          <div>
            <h3>Video Preview:</h3>
            <video width="300" controls>
              <source src={videoPreview} type={video.type} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Lift'}
        </button>
      </form>

      {submittedVideos.length > 0 && (
        <div className="submitted-videos">
          <h3>Your Submitted Videos</h3>
          <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            {submittedVideos
              .filter(video => video.user === currentUser.username) // Filter by current user
              .map((video, index) => (
                <div key={index}>
                  <p>{video.type} - {video.weight} lbs</p> 
                  <video width="300" controls>
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmitLift;