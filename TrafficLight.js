import React from 'react';
import './TrafficLight.css';

const TrafficLight = ({ direction, currentLight, isActive }) => {
  return (
    <div className={`traffic-light ${direction} ${isActive ? 'active' : ''}`}>
      <div className="traffic-light-header">
        <span className="direction-label">{direction}</span>
      </div>
      <div className="lights-container">
        <div 
          className={`light red ${currentLight === 'red' ? 'active' : ''}`}
        ></div>
        <div 
          className={`light yellow ${currentLight === 'yellow' ? 'active' : ''}`}
        ></div>
        <div 
          className={`light green ${currentLight === 'green' ? 'active' : ''}`}
        ></div>
      </div>
      <div className="status">
        {isActive ? '🟢 ACTIVO' : '🔴 DETENIDO'}
      </div>
    </div>
  );
};

export default TrafficLight;