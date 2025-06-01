import React from 'react';
import { ClipLoader } from 'react-spinners';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <ClipLoader
        color="#54AA7F"
        loading={true}
        size={50}
        aria-label="Loading Spinner"
      />
      <p className="loading-text">Đang tải...</p>
    </div>
  );
};

export default Loading; 