import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface MotionMissionProps {
  onBack: () => void;
  onComplete: () => void;
}

export function MotionMission({ onBack, onComplete }: MotionMissionProps) {
  const [level, setLevel] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(5); // meters per second
  const [targetDistance, setTargetDistance] = useState(50);
  const [userSpeed, setUserSpeed] = useState(5);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && distance < targetDistance) {
      interval = setInterval(() => {
        setTime(t => t + 0.1);
        setDistance(d => Math.min(d + (speed * 0.1), targetDistance));
      }, 100);
    } else if (distance >= targetDistance && isRunning) {
      setIsRunning(false);
      checkAnswer();
    }
    return () => clearInterval(interval);
  }, [isRunning, distance, targetDistance, speed]);

  const reset = () => {
    setIsRunning(false);
    setDistance(0);
    setTime(0);
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    const actualSpeed = targetDistance / time;
    const difference = Math.abs(actualSpeed - userSpeed);
    
    if (difference < 1) {
      setFeedback(`Perfect! The car traveled ${targetDistance}m in ${time.toFixed(1)}s. Speed = Distance ÷ Time = ${targetDistance} ÷ ${time.toFixed(1)} = ${actualSpeed.toFixed(2)} m/s. Your prediction was spot on!`);
      setShowFeedback(true);
      if (level === 3) {
        onComplete();
      }
    } else {
      setFeedback(`The car traveled ${targetDistance}m in ${time.toFixed(1)}s. Actual Speed = ${actualSpeed.toFixed(2)} m/s. You predicted ${userSpeed} m/s. Remember: Speed = Distance ÷ Time. Try again!`);
      setShowFeedback(true);
    }
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    if (level === 1) {
      setTargetDistance(100);
      setSpeed(8);
    } else if (level === 2) {
      setTargetDistance(75);
      setSpeed(6);
    }
    reset();
  };

  const startSimulation = () => {
    if (distance === 0) {
      setSpeed(userSpeed);
    }
    setIsRunning(true);
  };

  const progress = (distance / targetDistance) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-blue-900 hover:text-blue-700">
          <ArrowLeft className="w-5 h-5" />
          Back to Missions
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-blue-900 mb-2">Motion & Measurement</h2>
          <p className="text-gray-600 mb-6">Level {level} of 3: Understanding Speed, Distance, and Time</p>

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-blue-900 mb-3">The Challenge</h3>
            <p className="text-gray-700">
              A car needs to travel <span className="text-blue-700">{targetDistance} meters</span>. 
              Predict what speed it should travel at to complete the journey!
            </p>
            <div className="mt-4 bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Key Formula:</p>
              <p className="text-blue-900">Speed = Distance ÷ Time</p>
              <p className="text-sm text-gray-600 mt-2">Distance = Speed × Time</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Set Speed (meters per second): {userSpeed} m/s
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={userSpeed}
              onChange={(e) => setUserSpeed(Number(e.target.value))}
              disabled={distance > 0}
              className="w-full"
            />
          </div>

          {/* Visualization */}
          <div className="relative h-32 bg-gradient-to-b from-sky-300 to-green-200 rounded-xl mb-6 overflow-hidden">
            {/* Road */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-600">
              <div className="absolute top-1/2 left-0 right-0 h-1 border-t-4 border-dashed border-yellow-300"></div>
            </div>

            {/* Finish Line */}
            <div className="absolute bottom-0 right-8 w-2 h-16 bg-white border-l-4 border-r-4 border-black"></div>

            {/* Car */}
            <motion.div
              className="absolute bottom-4 left-4 text-4xl"
              animate={{ x: (progress / 100) * (window.innerWidth > 768 ? 800 : 300) }}
              transition={{ duration: 0.1, ease: "linear" }}
            >
              🚗
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Distance: {distance.toFixed(1)}m / {targetDistance}m</span>
              <span>Time: {time.toFixed(1)}s</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Speed</p>
              <p className="text-blue-900">{speed.toFixed(1)} m/s</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Distance</p>
              <p className="text-blue-900">{distance.toFixed(1)} m</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Time</p>
              <p className="text-blue-900">{time.toFixed(1)} s</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={startSimulation}
              disabled={isRunning || distance >= targetDistance}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {distance === 0 ? 'Start' : 'Resume'}
            </button>
            <button
              onClick={reset}
              className="bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`rounded-xl p-6 mb-6 ${feedback.includes('Perfect') ? 'bg-green-100 border-2 border-green-500' : 'bg-orange-100 border-2 border-orange-500'}`}>
              <h3 className={feedback.includes('Perfect') ? 'text-green-900' : 'text-orange-900'}>
                {feedback.includes('Perfect') ? '🎉 Correct!' : '🤔 Not Quite'}
              </h3>
              <p className="text-gray-700 mt-2">{feedback}</p>
              {feedback.includes('Perfect') && level < 3 && (
                <button
                  onClick={nextLevel}
                  className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                >
                  Next Level
                </button>
              )}
              {feedback.includes('Perfect') && level === 3 && (
                <p className="mt-4 text-green-900">🏆 Mission Complete! You've mastered motion and measurement!</p>
              )}
            </div>
          )}

          {/* Educational Content */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-indigo-900 mb-3">Real-World Example</h3>
            <p className="text-gray-700">
              A bicycle travels 100 meters in 20 seconds. What's its speed?<br />
              <span className="text-indigo-700">Speed = 100m ÷ 20s = 5 m/s</span>
            </p>
            <p className="text-gray-700 mt-3">
              If a bus travels at 15 m/s for 10 seconds, how far does it go?<br />
              <span className="text-indigo-700">Distance = 15 m/s × 10s = 150 meters</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
