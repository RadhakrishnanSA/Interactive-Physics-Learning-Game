import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface LightMissionProps {
  onBack: () => void;
  onComplete: () => void;
}

export function LightMission({ onBack, onComplete }: LightMissionProps) {
  const [level, setLevel] = useState(1);
  const [lightAngle, setLightAngle] = useState(45);
  const [mirrorAngle, setMirrorAngle] = useState(90);
  const [objectHeight, setObjectHeight] = useState(60);
  const [lightSourceDistance, setLightSourceDistance] = useState(150);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const calculateReflectionAngle = () => {
    // Angle of incidence = Angle of reflection
    const surfaceAngle = mirrorAngle;
    const incidenceAngle = Math.abs(lightAngle - surfaceAngle);
    const reflectionAngle = surfaceAngle + incidenceAngle;
    return reflectionAngle;
  };

  const calculateShadowLength = () => {
    // Shadow length increases as light source gets closer
    // Using basic trigonometry
    const ratio = lightSourceDistance / 100;
    return objectHeight * ratio;
  };

  const checkReflection = () => {
    const reflectionAngle = calculateReflectionAngle();
    const expectedReflection = mirrorAngle + (mirrorAngle - lightAngle);
    
    if (Math.abs(reflectionAngle - expectedReflection) < 5) {
      setFeedback(`Perfect! When light hits a mirror at ${Math.abs(lightAngle - mirrorAngle)}° from the normal, it reflects at the same angle on the other side. This is the Law of Reflection: Angle of Incidence = Angle of Reflection.`);
      setShowFeedback(true);
      if (level === 3) {
        onComplete();
      }
    }
  };

  const checkShadow = () => {
    const shadowLength = calculateShadowLength();
    const explanation = `The shadow length is ${shadowLength.toFixed(0)}px. When the light source is ${lightSourceDistance}px away and the object is ${objectHeight}px tall, the shadow forms behind the object. The closer the light source, the longer the shadow!`;
    setFeedback(explanation);
    setShowFeedback(true);
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    setShowFeedback(false);
    if (level === 1) {
      setLightAngle(60);
      setMirrorAngle(45);
    } else if (level === 2) {
      setObjectHeight(80);
      setLightSourceDistance(200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-yellow-900 hover:text-yellow-700">
          <ArrowLeft className="w-5 h-5" />
          Back to Missions
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-yellow-900 mb-2">Light & Shadows</h2>
          <p className="text-gray-600 mb-6">Level {level} of 3: Exploring Reflection and Shadow Formation</p>

          {level <= 2 ? (
            <>
              {/* Mirror Reflection Section */}
              <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                <h3 className="text-yellow-900 mb-3">Mirror Reflection</h3>
                <p className="text-gray-700">
                  Adjust the light angle and mirror angle to see how light reflects. The angle at which light hits the mirror (angle of incidence) equals the angle at which it bounces off (angle of reflection).
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Light Angle: {lightAngle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={lightAngle}
                    onChange={(e) => setLightAngle(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Mirror Angle: {mirrorAngle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={mirrorAngle}
                    onChange={(e) => setMirrorAngle(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Mirror Visualization */}
              <div className="relative h-64 bg-gray-900 rounded-xl mb-6 overflow-hidden">
                {/* Light Source */}
                <div
                  className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400"
                  style={{
                    left: '10%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Incident Ray */}
                <svg className="absolute inset-0 w-full h-full">
                  <line
                    x1="10%"
                    y1="50%"
                    x2="50%"
                    y2="50%"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    transform={`rotate(${lightAngle - 90} ${window.innerWidth * 0.1} ${128})`}
                    style={{ transformOrigin: '10% 50%' }}
                  />
                  
                  {/* Mirror */}
                  <line
                    x1="50%"
                    y1="20%"
                    x2="50%"
                    y2="80%"
                    stroke="#93c5fd"
                    strokeWidth="8"
                    transform={`rotate(${mirrorAngle - 90} 50% 50%)`}
                    style={{ transformOrigin: '50% 50%' }}
                  />

                  {/* Reflected Ray */}
                  <line
                    x1="50%"
                    y1="50%"
                    x2="90%"
                    y2="50%"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    transform={`rotate(${calculateReflectionAngle() - 90} 50% 50%)`}
                    style={{ transformOrigin: '50% 50%' }}
                  />
                </svg>

                {/* Labels */}
                <div className="absolute bottom-4 left-4 text-yellow-400 text-sm">
                  💡 Light Source
                </div>
                <div className="absolute bottom-4 right-4 text-blue-400 text-sm">
                  🪞 Mirror
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6 border-2 border-yellow-300">
                <p className="text-sm text-gray-600">Angle of Incidence: {Math.abs(lightAngle - mirrorAngle).toFixed(1)}°</p>
                <p className="text-sm text-gray-600">Angle of Reflection: {Math.abs(calculateReflectionAngle() - mirrorAngle).toFixed(1)}°</p>
              </div>

              <button
                onClick={checkReflection}
                className="w-full bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 mb-6"
              >
                Explain Reflection
              </button>
            </>
          ) : (
            <>
              {/* Shadow Formation Section */}
              <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                <h3 className="text-yellow-900 mb-3">Shadow Formation</h3>
                <p className="text-gray-700">
                  Shadows form when an opaque object blocks light. The size and length of the shadow depend on the position of the light source and the size of the object.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Object Height: {objectHeight}px
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="120"
                    value={objectHeight}
                    onChange={(e) => setObjectHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Light Distance: {lightSourceDistance}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    value={lightSourceDistance}
                    onChange={(e) => setLightSourceDistance(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Shadow Visualization */}
              <div className="relative h-64 bg-gradient-to-b from-sky-200 to-green-100 rounded-xl mb-6 overflow-hidden">
                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-800"></div>

                {/* Light Source */}
                <div
                  className="absolute w-8 h-8 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400"
                  style={{
                    left: `${Math.min(80, lightSourceDistance / 4)}%`,
                    top: '20%',
                  }}
                >
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Object (Tree) */}
                <div
                  className="absolute bg-yellow-800 rounded-t-full"
                  style={{
                    left: '40%',
                    bottom: '64px',
                    width: '20px',
                    height: `${objectHeight}px`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl">🌳</div>
                </div>

                {/* Shadow */}
                <div
                  className="absolute bg-black opacity-30 rounded-full"
                  style={{
                    left: '40%',
                    bottom: '64px',
                    width: `${calculateShadowLength()}px`,
                    height: '4px',
                    transformOrigin: 'left center',
                  }}
                ></div>

                {/* Light Rays */}
                <svg className="absolute inset-0 w-full h-full">
                  <line
                    x1={`${Math.min(80, lightSourceDistance / 4)}%`}
                    y1="20%"
                    x2="40%"
                    y2="75%"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.6"
                  />
                </svg>
              </div>

              <button
                onClick={checkShadow}
                className="w-full bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 mb-6"
              >
                Explain Shadow Formation
              </button>
            </>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className="rounded-xl p-6 mb-6 bg-green-100 border-2 border-green-500">
              <h3 className="text-green-900">💡 Explanation</h3>
              <p className="text-gray-700 mt-2">{feedback}</p>
              {level < 3 && (
                <button
                  onClick={nextLevel}
                  className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                >
                  Next Level
                </button>
              )}
              {level === 3 && (
                <p className="mt-4 text-green-900">🏆 Mission Complete! You understand light and shadows!</p>
              )}
            </div>
          )}

          {/* Educational Content */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-indigo-900 mb-3">Key Concepts</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <span className="text-indigo-700">Law of Reflection:</span> Angle of incidence = Angle of reflection</li>
              <li>• <span className="text-indigo-700">Shadows:</span> Formed when opaque objects block light</li>
              <li>• <span className="text-indigo-700">Light travels:</span> In straight lines until it hits an object</li>
              <li>• <span className="text-indigo-700">Shadow size:</span> Depends on light source position and object size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
