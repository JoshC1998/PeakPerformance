import React, { useState } from 'react';
import { useVideo } from './VideoContext'; 
import './SubmitLift.css'; // Assuming you have the CSS file for styling

const API_URL = 'http://localhost:5555'; 

function SubmitLift({ currentUser, onLiftSubmitted }) {
  const { submittedVideos, setSubmittedVideos } = useVideo(); 
  const [liftName, setLiftName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All'); // New state for active tab

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
      weight: liftName === 'Push-ups' || liftName === 'Pull-ups' ? undefined : weight,
      reps: liftName === 'Push-ups' || liftName === 'Pull-ups' ? reps : undefined,
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
          onLiftSubmitted(); 
          const newLift = {
            user: currentUser.username,
            type: liftName,
            weight: liftName === 'Push-ups' || liftName === 'Pull-ups' ? undefined : weight,
            reps: liftName === 'Push-ups' || liftName === 'Pull-ups' ? reps : undefined,
            videoUrl: videoUrl,
          };

          setSubmittedVideos(prev => [...prev, newLift]);

          setLiftName('');
          setWeight('');
          setReps('');
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="submit-lift">
      <h5>Submit a New Lift</h5>
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
              <option value="Push-ups">Push-ups</option>
              <option value="Pull-ups">Pull-ups</option>
            </select>
          </label>
        </div>
        {(liftName === 'Push-ups' || liftName === 'Pull-ups') && (
          <div>
            <label>
              Reps:
              <input
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
              />
            </label>
          </div>
        )}
        {(liftName !== 'Push-ups' && liftName !== 'Pull-ups') && (
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
        )}
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
          <h2>Submitted Videos</h2>
          <div className="tabs">
            <button
              className={activeTab === 'All' ? 'active' : ''}
              onClick={() => handleTabClick('All')}
            >
              All
            </button>
            <button
              className={activeTab === 'Bench' ? 'active' : ''}
              onClick={() => handleTabClick('Bench')}
            >
              Bench Press
            </button>
            <button
              className={activeTab === 'Deadlift' ? 'active' : ''}
              onClick={() => handleTabClick('Deadlift')}
            >
              Deadlift
            </button>
            <button
              className={activeTab === 'Squat' ? 'active' : ''}
              onClick={() => handleTabClick('Squat')}
            >
              Squat
            </button>
            <button
              className={activeTab === 'Push-ups' ? 'active' : ''}
              onClick={() => handleTabClick('Push-ups')}
            >
              Push-ups
            </button>
            <button
              className={activeTab === 'Pull-ups' ? 'active' : ''}
              onClick={() => handleTabClick('Pull-ups')}
            >
              Pull-ups
            </button>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            {submittedVideos
              .filter(video => activeTab === 'All' || video.type === activeTab)
              .filter(video => video.user === currentUser.username)
              .map((video, index) => (
                <div className="video-category" key={index}>
                  <h4>{video.type}</h4>
                  <div className="video-item">
                    <p>{video.weight ? `${video.weight} lbs` : `${video.reps} reps`}</p>
                    <video controls>
                      <source src={video.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmitLift;
