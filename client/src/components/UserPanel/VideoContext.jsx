import React, { createContext, useState, useContext } from 'react';

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [submittedVideos, setSubmittedVideos] = useState([]);

  return (
    <VideoContext.Provider value={{ submittedVideos, setSubmittedVideos }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  return useContext(VideoContext);
}










