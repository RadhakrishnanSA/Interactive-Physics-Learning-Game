import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface MagnetismMissionProps {
  onBack: () => void;
  onComplete: () => void;
}

type Pole = 'north' | 'south';

export function MagnetismMission({ onBack, onComplete }: MagnetismMissionProps) {
  const [level, setLevel] = useState(1);
  const [magnet1Pole, setMagnet1Pole] = useState<Pole>('north');
  const [magnet2Pole, setMagnet2Pole] = useState<Pole>('north');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [interactionType, setInteractionType] = useState<'attract' | 'repel' | 'none'>('none');

  const testMagnets = () => {
    if (magnet1Pole === magnet2Pole) {
      // Same poles repel
      setInteractionType('repel');
      setFeedback(`🔴 Repulsion! Both magnets have their ${magnet1Pole.toUpperCase()} poles facing each other. Like poles (N-N or S-S) REPEL each other. The magnetic forces push the magnets apart. This happens because the magnetic field lines are in opposite directions at the poles.`);
      setShowFeedback(true);
    } else {
      // Opposite poles attract
      setInteractionType('attract');
      setFeedback(`🟢 Attraction! The magnets have opposite poles facing each other (${magnet1Pole.toUpperCase()}-${magnet2Pole.toUpperCase()}). Unlike poles (N-S or S-N) ATTRACT each other. The magnetic forces pull the magnets together. This happens because the magnetic field lines flow from North to South, creating a pulling force.`);
      setShowFeedback(true);
      
      if (level === 3) {
        onComplete();
      }
    }
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    setShowFeedback(false);
    setInteractionType('none');
  };

  const flipMagnet1 = () => {
    setMagnet1Pole(magnet1Pole === 'north' ? 'south' : 'north');
    setShowFeedback(false);
    setInteractionType('none');
  };

  const flipMagnet2 = () => {
    setMagnet2Pole(magnet2Pole === 'north' ? 'south' : 'north');
    setShowFeedback(false);
    setInteractionType('none');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-blue-200 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-red-900 hover:text-red-700">
          <ArrowLeft className="w-5 h-5" />
          Back to Missions
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-red-900 mb-2">Magnetism</h2>
          <p className="text-gray-600 mb-6">Level {level} of 3: Understanding Magnetic Forces</p>

          <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-gray-900 mb-3">The Challenge</h3>
            <p className="text-gray-700">
              {level === 1 && 'Experiment with two magnets. See what happens when you bring the same poles together!'}
              {level === 2 && 'Now try bringing opposite poles together. Observe the difference in their behavior.'}
              {level === 3 && 'Master magnetic interactions by predicting attraction and repulsion patterns!'}
            </p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border-2 border-yellow-300">
            <p className="text-sm text-gray-700">
              <strong>Remember:</strong> Every magnet has two poles - North (N) and South (S). Click on the magnets to flip them!
            </p>
          </div>

          {/* Magnet Controls */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <p className="text-gray-700 mb-3">Magnet 1 (Left)</p>
              <button
                onClick={flipMagnet1}
                className="w-full bg-gradient-to-r from-red-500 to-blue-500 text-white py-3 rounded-xl hover:opacity-90"
              >
                Click to Flip
              </button>
              <p className="mt-2 text-gray-600">Facing: {magnet1Pole.toUpperCase()} pole</p>
            </div>
            <div className="text-center">
              <p className="text-gray-700 mb-3">Magnet 2 (Right)</p>
              <button
                onClick={flipMagnet2}
                className="w-full bg-gradient-to-r from-blue-500 to-red-500 text-white py-3 rounded-xl hover:opacity-90"
              >
                Click to Flip
              </button>
              <p className="mt-2 text-gray-600">Facing: {magnet2Pole.toUpperCase()} pole</p>
            </div>
          </div>

          {/* Visualization */}
          <div className="relative h-64 bg-gray-50 rounded-xl mb-6 overflow-hidden border-2 border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center gap-8">
              {/* Magnet 1 */}
              <motion.div
                animate={{
                  x: interactionType === 'repel' ? -20 : interactionType === 'attract' ? 10 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative"
              >
                <div className="w-32 h-40 rounded-xl shadow-lg overflow-hidden border-4 border-gray-800">
                  <div className={`h-1/2 flex items-center justify-center ${
                    magnet1Pole === 'north' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    <span className="text-white text-3xl">
                      {magnet1Pole === 'north' ? 'N' : 'S'}
                    </span>
                  </div>
                  <div className={`h-1/2 flex items-center justify-center ${
                    magnet1Pole === 'north' ? 'bg-blue-500' : 'bg-red-500'
                  }`}>
                    <span className="text-white text-3xl">
                      {magnet1Pole === 'north' ? 'S' : 'N'}
                    </span>
                  </div>
                </div>
                
                {/* Field lines */}
                {interactionType !== 'none' && (
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                    <svg width="40" height="120" className="opacity-60">
                      {interactionType === 'attract' ? (
                        <>
                          <path d="M 0 30 Q 20 30 35 60" stroke="#10b981" strokeWidth="2" fill="none" />
                          <path d="M 0 60 L 35 60" stroke="#10b981" strokeWidth="2" fill="none" />
                          <path d="M 0 90 Q 20 90 35 60" stroke="#10b981" strokeWidth="2" fill="none" />
                        </>
                      ) : (
                        <>
                          <path d="M 35 30 Q 20 30 0 10" stroke="#ef4444" strokeWidth="2" fill="none" />
                          <path d="M 35 60 Q 20 60 0 60" stroke="#ef4444" strokeWidth="2" fill="none" />
                          <path d="M 35 90 Q 20 90 0 110" stroke="#ef4444" strokeWidth="2" fill="none" />
                        </>
                      )}
                    </svg>
                  </div>
                )}
              </motion.div>

              {/* Interaction indicator */}
              <div className="text-4xl">
                {interactionType === 'attract' && '←→'}
                {interactionType === 'repel' && '↔'}
                {interactionType === 'none' && '---'}
              </div>

              {/* Magnet 2 */}
              <motion.div
                animate={{
                  x: interactionType === 'repel' ? 20 : interactionType === 'attract' ? -10 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative"
              >
                <div className="w-32 h-40 rounded-xl shadow-lg overflow-hidden border-4 border-gray-800">
                  <div className={`h-1/2 flex items-center justify-center ${
                    magnet2Pole === 'north' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    <span className="text-white text-3xl">
                      {magnet2Pole === 'north' ? 'N' : 'S'}
                    </span>
                  </div>
                  <div className={`h-1/2 flex items-center justify-center ${
                    magnet2Pole === 'north' ? 'bg-blue-500' : 'bg-red-500'
                  }`}>
                    <span className="text-white text-3xl">
                      {magnet2Pole === 'north' ? 'S' : 'N'}
                    </span>
                  </div>
                </div>

                {/* Field lines */}
                {interactionType !== 'none' && (
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2">
                    <svg width="40" height="120" className="opacity-60">
                      {interactionType === 'attract' ? (
                        <>
                          <path d="M 40 30 Q 20 30 5 60" stroke="#10b981" strokeWidth="2" fill="none" />
                          <path d="M 40 60 L 5 60" stroke="#10b981" strokeWidth="2" fill="none" />
                          <path d="M 40 90 Q 20 90 5 60" stroke="#10b981" strokeWidth="2" fill="none" />
                        </>
                      ) : (
                        <>
                          <path d="M 5 30 Q 20 30 40 10" stroke="#ef4444" strokeWidth="2" fill="none" />
                          <path d="M 5 60 Q 20 60 40 60" stroke="#ef4444" strokeWidth="2" fill="none" />
                          <path d="M 5 90 Q 20 90 40 110" stroke="#ef4444" strokeWidth="2" fill="none" />
                        </>
                      )}
                    </svg>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>North Pole</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>South Pole</span>
              </div>
            </div>
          </div>

          {/* Current Configuration */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-center text-gray-700">
              Configuration: <span className="text-gray-900">{magnet1Pole.toUpperCase()}</span> facing <span className="text-gray-900">{magnet2Pole.toUpperCase()}</span>
            </p>
          </div>

          <button
            onClick={testMagnets}
            className="w-full bg-gradient-to-r from-red-500 to-blue-500 text-white py-3 rounded-xl hover:opacity-90 mb-6"
          >
            Test Magnetic Interaction
          </button>

          {/* Feedback */}
          {showFeedback && (
            <div className={`rounded-xl p-6 mb-6 ${
              interactionType === 'attract' 
                ? 'bg-green-100 border-2 border-green-500' 
                : 'bg-red-100 border-2 border-red-500'
            }`}>
              <h3 className={interactionType === 'attract' ? 'text-green-900' : 'text-red-900'}>
                {interactionType === 'attract' ? '🧲 Attraction!' : '⚡ Repulsion!'}
              </h3>
              <p className="text-gray-700 mt-2">{feedback}</p>
              {interactionType === 'attract' && level < 3 && (
                <button
                  onClick={nextLevel}
                  className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                >
                  Next Level
                </button>
              )}
              {interactionType === 'attract' && level === 3 && (
                <p className="mt-4 text-green-900">🏆 Mission Complete! You understand magnetism!</p>
              )}
            </div>
          )}

          {/* Educational Content */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-indigo-900 mb-3">Magnetic Properties</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="text-indigo-700">• Like Poles Repel:</span> N-N or S-S poles push away from each other
              </p>
              <p>
                <span className="text-indigo-700">• Unlike Poles Attract:</span> N-S poles pull toward each other
              </p>
              <p>
                <span className="text-indigo-700">• Magnetic Field:</span> The invisible force field around a magnet
              </p>
              <p>
                <span className="text-indigo-700">• Real-world uses:</span> Compass needles, refrigerator magnets, electric motors, speakers
              </p>
              <p>
                <span className="text-indigo-700">• Earth is a magnet:</span> That's why compass needles point North!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
