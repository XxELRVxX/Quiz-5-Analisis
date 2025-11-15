import { useState, useEffect, useRef, useCallback } from 'react';

// Configuración de tiempos (en milisegundos)
const TIMING_CONFIG = {
  green: 5000,    // 5 segundos en verde
  yellow: 2000,   // 2 segundos en amarillo
  red: 7000,      // 7 segundos en rojo (incluye tiempo de amarillo opuesto)
};

const useTrafficController = () => {
  const [lights, setLights] = useState({
    Norte: 'red',
    Sur: 'red',
    Este: 'green',
    Oeste: 'green'
  });

  const [cycleTime, setCycleTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [stats, setStats] = useState({
    cyclesCompleted: 0,
    lastChange: new Date()
  });

  const intervalRef = useRef(null);
  const cycleStartRef = useRef(Date.now());

  // Función para cambiar las luces de forma coordinada
  const changeLights = useCallback(() => {
    setLights(prev => {
      const now = new Date();
      setStats(current => ({
        cyclesCompleted: current.cyclesCompleted + 0.5,
        lastChange: now
      }));

      // Alternar entre los dos pares de direcciones
      if (prev.Norte === 'red') {
        // Cambiar Norte-Sur a verde y Este-Oeste a rojo
        return {
          Norte: 'green',
          Sur: 'green',
          Este: 'red',
          Oeste: 'red'
        };
      } else {
        // Cambiar Norte-Sur a rojo y Este-Oeste a verde
        return {
          Norte: 'red',
          Sur: 'red',
          Este: 'green',
          Oeste: 'green'
        };
      }
    });
  }, []);

  // Función para la secuencia de amarillo
  const startYellowSequence = useCallback((directionPair) => {
    setLights(prev => {
      const newLights = { ...prev };
      
      if (directionPair === 'NS') {
        // Norte-Sur cambian a amarillo antes de rojo
        if (prev.Norte === 'green') {
          newLights.Norte = 'yellow';
          newLights.Sur = 'yellow';
        }
      } else {
        // Este-Oeste cambian a amarillo antes de rojo
        if (prev.Este === 'green') {
          newLights.Este = 'yellow';
          newLights.Oeste = 'yellow';
        }
      }
      
      return newLights;
    });
  }, []);

  // Iniciar el sistema de semáforos
  const startSystem = useCallback(() => {
    if (intervalRef.current) return;

    setIsRunning(true);
    cycleStartRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - cycleStartRef.current;
      setCycleTime(elapsed % (TIMING_CONFIG.green + TIMING_CONFIG.yellow + TIMING_CONFIG.red));

      // Lógica de cambios coordinados
      const cyclePosition = elapsed % (TIMING_CONFIG.green * 2 + TIMING_CONFIG.yellow * 2);

      if (cyclePosition < TIMING_CONFIG.green) {
        // Fase 1: Este-Oeste verde, Norte-Sur rojo
        setLights({
          Norte: 'red',
          Sur: 'red',
          Este: 'green',
          Oeste: 'green'
        });
      } else if (cyclePosition < TIMING_CONFIG.green + TIMING_CONFIG.yellow) {
        // Fase 2: Este-Oeste amarillo, Norte-Sur rojo
        setLights({
          Norte: 'red',
          Sur: 'red',
          Este: 'yellow',
          Oeste: 'yellow'
        });
      } else if (cyclePosition < TIMING_CONFIG.green * 2 + TIMING_CONFIG.yellow) {
        // Fase 3: Norte-Sur verde, Este-Oeste rojo
        setLights({
          Norte: 'green',
          Sur: 'green',
          Este: 'red',
          Oeste: 'red'
        });
      } else {
        // Fase 4: Norte-Sur amarillo, Este-Oeste rojo
        setLights({
          Norte: 'yellow',
          Sur: 'yellow',
          Este: 'red',
          Oeste: 'red'
        });
      }

    }, 100); // Actualizar cada 100ms para mayor precisión
  }, []);

  // Detener el sistema
  const stopSystem = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Reiniciar el sistema
  const resetSystem = useCallback(() => {
    stopSystem();
    setLights({
      Norte: 'red',
      Sur: 'red',
      Este: 'green',
      Oeste: 'green'
    });
    setCycleTime(0);
    setStats({
      cyclesCompleted: 0,
      lastChange: new Date()
    });
  }, [stopSystem]);

  // Efecto para iniciar/detener el sistema
  useEffect(() => {
    if (isRunning) {
      startSystem();
    } else {
      stopSystem();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startSystem, stopSystem]);

  return {
    lights,
    cycleTime,
    isRunning,
    stats,
    startSystem: () => setIsRunning(true),
    stopSystem: () => setIsRunning(false),
    resetSystem,
    timingConfig: TIMING_CONFIG
  };
};

export default useTrafficController;