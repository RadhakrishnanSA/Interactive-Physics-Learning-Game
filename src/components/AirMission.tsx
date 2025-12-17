import { useState, useEffect } from 'react';
import { ArrowLeft, Wind } from 'lucide-react';

interface AirMissionProps {
  onBack: () => void;
  onComplete: () => void;
}

export function AirMission({ onBack, onComplete }: AirMissionProps) {
  const [level, setLevel] = useState(1);
  const [bottleState, setBottleState] = useState<'empty' | 'compressed' | 'normal'>('normal');
  const [balloonSize, setBalloonSize] = useState(50);
  const [airPressure, setAirPressure] = useState(100);
  const [altitude, setAltitude] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Update balloon size based on altitude (pressure decreases with altitude)
    const pressureAtAltitude = 100 - (altitude * 0.3);
    setAirPressure(Math.max(20, pressureAtAltitude));
    
    // Balloon expands as pressure decreases
    const newSize = 50 + (altitude * 0.5);
    setBalloonSize(Math.min(120, newSize));
  }, [altitude]);

  const compressBottle = () => {
    setBottleState('compressed');
    setShowFeedback(false);
  };

  const releaseBottle = () => {
    setBottleState('empty');
    setShowFeedback(false);
  };

  const resetBottle = () => {
    setBottleState('normal');
    setShowFeedback(false);
  };

  const explainBottle = () => {
    let explanation = '';
    
    if (bottleState === 'normal') {
      explanation = `The bottle contains air at normal atmospheric pressure. Air is a mixture of gases (78% Nitrogen, 21% Oxygen, 1% other gases). Even though we can't see air, it has mass and occupies space. The air molecules are moving freely inside the bottle, colliding with the walls and creating pressure.`;
    } else if (bottleState === 'compressed') {
      explanation = `When we squeeze the bottle, we COMPRESS the air inside. This means the same amount of air now occupies less space. The air molecules are packed closer together, creating HIGHER PRESSURE. You can feel this pressure pushing back when you squeeze! This demonstrates that air occupies space and can be compressed.`;
    } else {
      explanation = `When we release the compressed bottle, air rushes OUT because the pressure inside was higher than outside. Air always moves from HIGH pressure to LOW pressure. This is why wind blows - it's air moving from high pressure areas to low pressure areas! The bottle returns to its original shape as air flows back in.`;
    }

    setFeedback(explanation);
    setShowFeedback(true);

    if (level === 3) {
      onComplete();
    }
  };

  const explainAltitude = () => {
    const explanation = `At ${altitude}m altitude:\n\n` +
      `Air Pressure: ${airPressure.toFixed(1)}% of sea level pressure\n` +
      `Balloon Size: ${((balloonSize / 50) * 100).toFixed(0)}% of original size\n\n` +
      `🎈 Why does the balloon expand?\n` +
      `As we go higher, there are fewer air molecules above us, so atmospheric pressure DECREASES. ` +
      `The air inside the balloon pushes outward with the same force, but there's less outside pressure pushing back, ` +
      `so the balloon EXPANDS!\n\n` +
      `This is why:\n` +
      `• Airplane cabins are pressurized\n` +
      `• Your ears "pop" when going up mountains\n` +
      `• Chip bags puff up on airplanes\n` +
      `• Weather balloons expand as they rise`;

    setFeedback(explanation);
    setShowFeedback(true);

    if (level === 3) {
      onComplete();
    }
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    setBottleState('normal');
    setBalloonSize(50);
    setAirPressure(100);
    setAltitude(0);
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-sky-200 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-cyan-900 hover:text-cyan-700">
          <ArrowLeft className="w-5 h-5" />
          Back to Missions
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-cyan-900 mb-2">Air Around Us</h2>
          <p className="text-gray-600 mb-6">Level {level} of 3: Understanding Air Pressure and Properties</p>

          <div className="bg-cyan-50 rounded-xl p-6 mb-6">
            <h3 className="text-cyan-900 mb-3">The Challenge</h3>
            <p className="text-gray-700">
              {level === 1 && 'Explore how air occupies space and can be compressed by squeezing a bottle!'}
              {level === 2 && 'See how air pressure changes with altitude using a balloon!'}
              {level === 3 && 'Master air pressure concepts by understanding how pressure affects our daily lives!'}
            </p>
          </div>

          {level === 1 ? (
            <>
              {/* Bottle Experiment */}
              <div className="mb-6">
                <h3 className="text-gray-900 mb-4">Experiment: Air in a Bottle</h3>
                <div className="relative h-80 bg-gradient-to-b from-sky-200 to-green-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                  {/* Wind/Air particles */}
                  {bottleState !== 'empty' && (
                    <>
                      <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="absolute top-40 left-32 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-32 left-48 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="absolute bottom-32 right-32 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      <div className="absolute bottom-40 right-48 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </>
                  )}

                  {/* Bottle */}
                  <div className="relative">
                    <div 
                      className={`transition-all duration-300 ${
                        bottleState === 'compressed' ? 'scale-90' : bottleState === 'empty' ? 'scale-95' : 'scale-100'
                      }`}
                    >
                      {/* Bottle body */}
                      <div className="relative w-32 h-48 bg-cyan-200 bg-opacity-40 border-4 border-cyan-600 rounded-3xl">
                        {/* Air molecules inside */}
                        {bottleState !== 'empty' && (
                          <div className={`absolute inset-4 ${bottleState === 'compressed' ? 'bg-cyan-300' : 'bg-cyan-200'} rounded-2xl flex flex-wrap gap-2 p-2 justify-center items-center`}>
                            {Array.from({ length: bottleState === 'compressed' ? 16 : 9 }).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                            ))}
                          </div>
                        )}
                        
                        {/* Bottle cap */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-blue-900 rounded-t-lg"></div>
                      </div>
                      
                      {/* Label */}
                      <div className="absolute inset-x-0 top-16 text-center">
                        <p className="text-xs text-cyan-900">
                          {bottleState === 'normal' && 'Normal Pressure'}
                          {bottleState === 'compressed' && 'High Pressure!'}
                          {bottleState === 'empty' && 'Air Released'}
                        </p>
                      </div>
                    </div>

                    {/* Pressure arrows */}
                    {bottleState === 'compressed' && (
                      <>
                        <div className="absolute -left-8 top-1/2 text-2xl animate-pulse">←</div>
                        <div className="absolute -right-8 top-1/2 text-2xl animate-pulse">→</div>
                      </>
                    )}

                    {/* Escaping air */}
                    {bottleState === 'empty' && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <Wind className="w-8 h-8 text-cyan-500 animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={compressBottle}
                    disabled={bottleState === 'empty'}
                    className="bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Squeeze Bottle
                  </button>
                  <button
                    onClick={releaseBottle}
                    disabled={bottleState !== 'compressed'}
                    className="bg-cyan-500 text-white py-3 rounded-xl hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Release Air
                  </button>
                  <button
                    onClick={resetBottle}
                    className="bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600"
                  >
                    Reset
                  </button>
                </div>

                <button
                  onClick={explainBottle}
                  className="w-full bg-cyan-600 text-white py-3 rounded-xl hover:bg-cyan-700"
                >
                  Explain What's Happening
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Altitude Experiment */}
              <div className="mb-6">
                <h3 className="text-gray-900 mb-4">Experiment: Air Pressure and Altitude</h3>
                
                <div className="relative h-96 bg-gradient-to-b from-blue-900 via-sky-300 to-green-200 rounded-xl mb-6 overflow-hidden">
                  {/* Altitude markers */}
                  <div className="absolute left-4 top-0 bottom-0 w-1 bg-white opacity-50"></div>
                  <div className="absolute left-4 top-0 text-white text-xs">10km</div>
                  <div className="absolute left-4 top-1/4 text-white text-xs">7.5km</div>
                  <div className="absolute left-4 top-1/2 text-gray-700 text-xs">5km</div>
                  <div className="absolute left-4 top-3/4 text-gray-700 text-xs">2.5km</div>
                  <div className="absolute left-4 bottom-0 text-gray-700 text-xs">0km (Sea Level)</div>

                  {/* Balloon */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
                    style={{
                      bottom: `${(altitude / 100) * 80 + 5}%`,
                    }}
                  >
                    <div
                      className="rounded-full bg-red-400 border-4 border-red-600 flex items-center justify-center transition-all duration-500"
                      style={{
                        width: `${balloonSize}px`,
                        height: `${balloonSize}px`,
                      }}
                    >
                      <span className="text-white text-2xl">🎈</span>
                    </div>
                    {/* String */}
                    <div className="absolute top-full left-1/2 w-0.5 h-12 bg-gray-600"></div>
                  </div>

                  {/* Clouds */}
                  <div className="absolute top-1/3 right-12 text-4xl opacity-60">☁️</div>
                  <div className="absolute top-1/2 left-16 text-3xl opacity-60">☁️</div>

                  {/* Ground */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-green-700"></div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Altitude: {altitude}m (Air Pressure: {airPressure.toFixed(1)}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={altitude}
                    onChange={(e) => setAltitude(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Sea Level</span>
                    <span>10km High</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Air Pressure</p>
                    <p className="text-2xl text-blue-900">{airPressure.toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">of sea level</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Balloon Size</p>
                    <p className="text-2xl text-red-900">{((balloonSize / 50) * 100).toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">of original</p>
                  </div>
                </div>

                <button
                  onClick={explainAltitude}
                  className="w-full bg-cyan-600 text-white py-3 rounded-xl hover:bg-cyan-700"
                >
                  Explain Air Pressure Changes
                </button>
              </div>
            </>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className="rounded-xl p-6 mb-6 bg-green-100 border-2 border-green-500">
              <h3 className="text-green-900">💨 Air Pressure Explained</h3>
              <p className="text-gray-700 mt-2 whitespace-pre-line">{feedback}</p>
              {level < 3 && (
                <button
                  onClick={nextLevel}
                  className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                >
                  Next Level
                </button>
              )}
              {level === 3 && (
                <p className="mt-4 text-green-900">🏆 Mission Complete! You understand air and air pressure!</p>
              )}
            </div>
          )}

          {/* Educational Content */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-indigo-900 mb-3">Properties of Air</h3>
            <div className="space-y-2 text-gray-700">
              <p>• <span className="text-indigo-700">Air has mass:</span> It has weight (atmospheric pressure at sea level = 1 kg/cm²)</p>
              <p>• <span className="text-indigo-700">Air occupies space:</span> It fills any container it's in</p>
              <p>• <span className="text-indigo-700">Air can be compressed:</span> You can squeeze it into smaller spaces</p>
              <p>• <span className="text-indigo-700">Air exerts pressure:</span> It pushes on everything from all directions</p>
              <p>• <span className="text-indigo-700">Air is a mixture:</span> 78% Nitrogen, 21% Oxygen, 1% other gases</p>
              <p>• <span className="text-indigo-700">We need air:</span> For breathing, burning, and flying planes!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
