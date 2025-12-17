import { useState, useEffect } from 'react';
import { ArrowLeft, Flame, Snowflake } from 'lucide-react';

interface HeatMissionProps {
  onBack: () => void;
  onComplete: () => void;
}

type Material = 'metal' | 'wood' | 'plastic';

export function HeatMission({ onBack, onComplete }: HeatMissionProps) {
  const [level, setLevel] = useState(1);
  const [temperature, setTemperature] = useState(25);
  const [isHeating, setIsHeating] = useState(false);
  const [isCooling, setIsCooling] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material>('metal');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const materialProperties = {
    metal: { conductivity: 'high', heatRate: 2, coolRate: 1.5, color: '#94a3b8' },
    wood: { conductivity: 'low', heatRate: 0.5, coolRate: 0.3, color: '#92400e' },
    plastic: { conductivity: 'low', heatRate: 0.7, coolRate: 0.4, color: '#f97316' },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const rate = materialProperties[selectedMaterial].heatRate;
    const coolRate = materialProperties[selectedMaterial].coolRate;

    if (isHeating && temperature < 100) {
      interval = setInterval(() => {
        setTemperature(t => Math.min(t + rate, 100));
      }, 100);
    } else if (isCooling && temperature > 0) {
      interval = setInterval(() => {
        setTemperature(t => Math.max(t - coolRate, 0));
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isHeating, isCooling, temperature, selectedMaterial]);

  const startHeating = () => {
    setIsHeating(true);
    setIsCooling(false);
    setShowFeedback(false);
  };

  const startCooling = () => {
    setIsCooling(true);
    setIsHeating(false);
    setShowFeedback(false);
  };

  const stop = () => {
    setIsHeating(false);
    setIsCooling(false);
  };

  const explainHeat = () => {
    const material = selectedMaterial;
    const props = materialProperties[material];
    
    let explanation = '';
    
    if (isHeating || temperature > 30) {
      explanation += `When we heat ${material}, thermal energy is transferred to it. `;
      
      if (props.conductivity === 'high') {
        explanation += `Metal is a GOOD CONDUCTOR of heat. Its atoms are closely packed and transfer heat energy quickly through vibrations. That's why metal spoons get hot fast! `;
      } else {
        explanation += `${material.charAt(0).toUpperCase() + material.slice(1)} is a POOR CONDUCTOR (or insulator) of heat. Its atoms don't transfer heat energy efficiently. That's why ${material} handles stay cool longer! `;
      }
    }
    
    if (isCooling || temperature < 70) {
      explanation += `When cooling, heat energy moves from the ${material} to the surrounding air. This is called HEAT TRANSFER. Heat always flows from hot to cold objects until they reach the same temperature. `;
    }

    explanation += `\n\nCurrent temperature: ${temperature.toFixed(1)}°C. `;
    
    if (temperature < 15) {
      explanation += 'This is COLD - lower than room temperature.';
    } else if (temperature < 30) {
      explanation += 'This is room temperature - comfortable to touch.';
    } else if (temperature < 50) {
      explanation += 'This is WARM - noticeable heat but safe.';
    } else if (temperature < 70) {
      explanation += 'This is HOT - uncomfortable to touch for long.';
    } else {
      explanation += 'This is VERY HOT - dangerous to touch! Water would boil at 100°C.';
    }

    setFeedback(explanation);
    setShowFeedback(true);

    if (level === 3) {
      onComplete();
    }
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    setTemperature(25);
    setIsHeating(false);
    setIsCooling(false);
    setShowFeedback(false);
    if (level === 1) {
      setSelectedMaterial('wood');
    } else if (level === 2) {
      setSelectedMaterial('plastic');
    }
  };

  const reset = () => {
    setTemperature(25);
    setIsHeating(false);
    setIsCooling(false);
    setShowFeedback(false);
  };

  const getTemperatureColor = () => {
    if (temperature < 20) return 'from-blue-400 to-blue-600';
    if (temperature < 40) return 'from-green-400 to-green-600';
    if (temperature < 60) return 'from-yellow-400 to-yellow-600';
    if (temperature < 80) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-200 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-orange-900 hover:text-orange-700">
          <ArrowLeft className="w-5 h-5" />
          Back to Missions
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-orange-900 mb-2">Heat</h2>
          <p className="text-gray-600 mb-6">Level {level} of 3: Understanding Heat Transfer and Temperature</p>

          <div className="bg-orange-50 rounded-xl p-6 mb-6">
            <h3 className="text-orange-900 mb-3">The Challenge</h3>
            <p className="text-gray-700">
              {level === 1 && 'Heat a metal spoon and observe how quickly it conducts heat. Metal is a good conductor!'}
              {level === 2 && 'Now try heating wood. Notice how it heats up slower than metal - it\'s a poor conductor!'}
              {level === 3 && 'Compare all materials and understand why some conduct heat better than others!'}
            </p>
          </div>

          {/* Material Selection */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4">Material: {selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)}</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedMaterial('metal')}
                disabled={level === 2 || isHeating || isCooling}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMaterial === 'metal' 
                    ? 'bg-gray-500 text-white border-gray-600' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                } disabled:opacity-50`}
              >
                <div className="text-4xl mb-2">🥄</div>
                <p className="text-sm">Metal</p>
                <p className="text-xs text-gray-500">Good Conductor</p>
              </button>
              <button
                onClick={() => setSelectedMaterial('wood')}
                disabled={level === 1 || level === 3 || isHeating || isCooling}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMaterial === 'wood' 
                    ? 'bg-yellow-700 text-white border-yellow-800' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                } disabled:opacity-50`}
              >
                <div className="text-4xl mb-2">🪵</div>
                <p className="text-sm">Wood</p>
                <p className="text-xs text-gray-500">Poor Conductor</p>
              </button>
              <button
                onClick={() => setSelectedMaterial('plastic')}
                disabled={level === 1 || level === 2 || isHeating || isCooling}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMaterial === 'plastic' 
                    ? 'bg-orange-500 text-white border-orange-600' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                } disabled:opacity-50`}
              >
                <div className="text-4xl mb-2">🥤</div>
                <p className="text-sm">Plastic</p>
                <p className="text-xs text-gray-500">Insulator</p>
              </button>
            </div>
          </div>

          {/* Thermometer Visualization */}
          <div className="relative h-80 bg-gray-50 rounded-xl mb-6 overflow-hidden border-2 border-gray-200 flex items-center justify-center">
            {/* Heat source */}
            {isHeating && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <Flame className="w-16 h-16 text-orange-500 animate-pulse" />
                <p className="text-center text-sm text-orange-700 mt-2">Heat Source</p>
              </div>
            )}

            {/* Ice/cooling */}
            {isCooling && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <Snowflake className="w-16 h-16 text-blue-500 animate-pulse" />
                <p className="text-center text-sm text-blue-700 mt-2">Cooling</p>
              </div>
            )}

            {/* Object being heated */}
            <div className="flex flex-col items-center">
              <div
                className={`w-32 h-48 rounded-lg border-4 border-gray-800 transition-all duration-300`}
                style={{
                  backgroundColor: materialProperties[selectedMaterial].color,
                  boxShadow: temperature > 40 ? `0 0 ${temperature}px rgba(239, 68, 68, 0.5)` : 'none',
                }}
              >
                <div className="h-full flex items-center justify-center text-white text-6xl">
                  {selectedMaterial === 'metal' && '🥄'}
                  {selectedMaterial === 'wood' && '🪵'}
                  {selectedMaterial === 'plastic' && '🥤'}
                </div>
              </div>
              <p className="mt-4 text-gray-700">{selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)}</p>
            </div>

            {/* Thermometer */}
            <div className="absolute right-12 top-8 bg-white rounded-full p-4 border-4 border-gray-800 shadow-lg">
              <div className="w-16 h-48 bg-gray-200 rounded-full overflow-hidden relative">
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getTemperatureColor()} transition-all duration-300`}
                  style={{ height: `${temperature}%` }}
                ></div>
              </div>
              <p className="text-center mt-2 text-gray-900">{temperature.toFixed(1)}°C</p>
            </div>
          </div>

          {/* Temperature Info */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg text-center ${temperature < 20 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
              <Snowflake className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm">Cold</p>
              <p className="text-xs text-gray-600">0-20°C</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${temperature >= 20 && temperature < 60 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
              <div className="w-6 h-6 mx-auto mb-2 text-2xl">🌡️</div>
              <p className="text-sm">Warm</p>
              <p className="text-xs text-gray-600">20-60°C</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${temperature >= 60 ? 'bg-red-100 border-2 border-red-500' : 'bg-gray-100'}`}>
              <Flame className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="text-sm">Hot</p>
              <p className="text-xs text-gray-600">60-100°C</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={startHeating}
              disabled={isHeating || temperature >= 100}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5" />
              Heat Up
            </button>
            <button
              onClick={startCooling}
              disabled={isCooling || temperature <= 0}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Snowflake className="w-5 h-5" />
              Cool Down
            </button>
            <button
              onClick={stop}
              disabled={!isHeating && !isCooling}
              className="bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Stop
            </button>
          </div>

          <button
            onClick={explainHeat}
            className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 mb-6"
          >
            Explain Heat Transfer
          </button>

          {/* Feedback */}
          {showFeedback && (
            <div className="rounded-xl p-6 mb-6 bg-green-100 border-2 border-green-500">
              <h3 className="text-green-900">🌡️ Heat Transfer Explained</h3>
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
                <p className="mt-4 text-green-900">🏆 Mission Complete! You understand heat and temperature!</p>
              )}
            </div>
          )}

          {/* Educational Content */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-indigo-900 mb-3">Heat & Temperature Concepts</h3>
            <div className="space-y-2 text-gray-700">
              <p>• <span className="text-indigo-700">Temperature:</span> A measure of how hot or cold something is</p>
              <p>• <span className="text-indigo-700">Heat:</span> Thermal energy that flows from hot to cold objects</p>
              <p>• <span className="text-indigo-700">Conductors:</span> Materials that transfer heat quickly (metals)</p>
              <p>• <span className="text-indigo-700">Insulators:</span> Materials that transfer heat slowly (wood, plastic)</p>
              <p>• <span className="text-indigo-700">Daily example:</span> Metal pot handles get hot, but wooden handles stay cool!</p>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
          >
            Reset Experiment
          </button>
        </div>
      </div>
    </div>
  );
}
