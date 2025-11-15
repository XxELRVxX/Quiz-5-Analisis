import React from 'react';
import TrafficLight from './components/TrafficLight';
import useTrafficController from './hooks/useTrafficController';
import './App.css';

function App() {
  const {
    lights,
    cycleTime,
    isRunning,
    stats,
    startSystem,
    stopSystem,
    resetSystem,
    timingConfig
  } = useTrafficController();

  // Calcular progreso del ciclo actual
  const totalCycleTime = timingConfig.green * 2 + timingConfig.yellow * 2;
  const cycleProgress = (cycleTime / totalCycleTime) * 100;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚦 Sistema de Semáforos Coordinados</h1>
        <p>Sistema de control de tráfico con computación paralela</p>
      </header>

      <div className="control-panel">
        <div className="controls">
          <button 
            onClick={isRunning ? stopSystem : startSystem}
            className={`control-btn ${isRunning ? 'stop' : 'start'}`}
          >
            {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
          </button>
          <button onClick={resetSystem} className="control-btn reset">
            🔄 Reiniciar
          </button>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Ciclos completados:</span>
            <span className="stat-value">{stats.cyclesCompleted.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Estado:</span>
            <span className="stat-value">
              {isRunning ? '🟢 Ejecutándose' : '🔴 Detenido'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Último cambio:</span>
            <span className="stat-value">
              {stats.lastChange.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <div className="cycle-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${cycleProgress}%` }}
          ></div>
        </div>
        <span>Progreso del ciclo: {Math.round(cycleProgress)}%</span>
      </div>

      <div className="intersection">
        <div className="road vertical-road">
          <div className="traffic-group">
            <TrafficLight 
              direction="Norte"
              currentLight={lights.Norte}
              isActive={lights.Norte === 'green' || lights.Norte === 'yellow'}
            />
          </div>
          
          <div className="center-area">
            <div className="intersection-center">🚗</div>
          </div>

          <div className="traffic-group">
            <TrafficLight 
              direction="Sur"
              currentLight={lights.Sur}
              isActive={lights.Sur === 'green' || lights.Sur === 'yellow'}
            />
          </div>
        </div>

        <div className="road horizontal-road">
          <div className="traffic-group">
            <TrafficLight 
              direction="Oeste"
              currentLight={lights.Oeste}
              isActive={lights.Oeste === 'green' || lights.Oeste === 'yellow'}
            />
          </div>
          
          <div className="center-area">
            {/* Centro ya está definido en el road vertical */}
          </div>

          <div className="traffic-group">
            <TrafficLight 
              direction="Este"
              currentLight={lights.Este}
              isActive={lights.Este === 'green' || lights.Este === 'yellow'}
            />
          </div>
        </div>
      </div>

      <div className="timing-info">
        <h3>Configuración de Tiempos:</h3>
        <div className="timing-grid">
          <div className="timing-item">
            <span className="light-indicator green"></span>
            <span>Verde: {timingConfig.green / 1000}s</span>
          </div>
          <div className="timing-item">
            <span className="light-indicator yellow"></span>
            <span>Amarillo: {timingConfig.yellow / 1000}s</span>
          </div>
          <div className="timing-item">
            <span className="light-indicator red"></span>
            <span>Rojo: {timingConfig.red / 1000}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;