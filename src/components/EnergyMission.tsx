import { useState } from 'react';
import { ArrowLeft, Sun, Zap, Droplets, Wind } from 'lucide-react';

interface EnergyMissionProps {
  onBack: () => void;
  onComplete: () => void;
}

type EnergySource = 'solar' | 'hydro' | 'wind' | 'battery';
type EnergyOutput = 'light' | 'motion' | 'heat' | 'sound';

export function EnergyMission({ onBack, onComplete }: EnergyMissionProps) {
  const [level, setLevel] = useState(1);
  const [selectedSource, setSelectedSource] = useState<EnergySource | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<EnergyOutput | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);

  const energySources = {
    solar: {
      name: 'Solar Panel',
      icon: Sun,
      description: 'Converts sunlight (light energy) to electrical energy',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      input: 'Light Energy from Sun',
    },
    hydro: {
      name: 'Water Turbine',
      icon: Droplets,
      description: 'Converts flowing water (kinetic energy) to electrical energy',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      input: 'Kinetic Energy from Water',
    },
    wind: {
      name: 'Wind Turbine',
      icon: Wind,
      description: 'Converts wind (kinetic energy) to electrical energy',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-100',
      input: 'Kinetic Energy from Wind',
    },
    battery: {
      name: 'Battery',
      icon: Zap,
      description: 'Converts chemical energy to electrical energy',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      input: 'Chemical Energy',
    },
  };

  const energyOutputs = {
    light: {
      name: 'Light Bulb',
      icon: '💡',
      description: 'Converts electrical energy to light energy (and some heat)',
      example: 'Bulbs, LEDs, tube lights',
    },
    motion: {
      name: 'Motor/Fan',
      icon: '🌀',
      description: 'Converts electrical energy to kinetic energy (motion)',
      example: 'Fans, washing machines, cars',
    },
    heat: {
      name: 'Heater',
      icon: '♨️',
      description: 'Converts electrical energy to heat energy',
      example: 'Iron, heater, electric stove',
    },
    sound: {
      name: 'Speaker',
      icon: '🔊',
      description: 'Converts electrical energy to sound energy',
      example: 'Speakers, bells, alarms',
    },
  };

  const transformEnergy = () => {
    if (!selectedSource || !selectedOutput) {
      setFeedback('⚠️ Please select both an energy source and an output device to see energy transformation!');
      setShowFeedback(true);
      return;
    }

    setIsTransforming(true);
    setTimeout(() => setIsTransforming(false), 2000);

    const source = energySources[selectedSource];
    const output = energyOutputs[selectedOutput];

    const explanation = `🌟 Energy Transformation Complete!\n\n` +
      `1️⃣ INPUT: ${source.name} takes ${source.input}\n` +
      `2️⃣ CONVERSION: It converts this to ELECTRICAL ENERGY\n` +
      `3️⃣ OUTPUT: The ${output.name} then converts electrical energy to ${output.description.split('to ')[1]}\n\n` +
      `Real-world example: ${output.example}\n\n` +
      `⚡ Key Principle: Energy cannot be created or destroyed, only transformed from one form to another! This is called the LAW OF CONSERVATION OF ENERGY.\n\n` +
      `💡 Fun Fact: Some energy is always "lost" as heat during transformation - no machine is 100% efficient!`;

    setFeedback(explanation);
    setShowFeedback(true);

    if (level === 3) {
      onComplete();
    }
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    setSelectedSource(null);
    setSelectedOutput(null);
    setShowFeedback(false);
    setIsTransforming(false);
  };

  const reset = () => {
    setSelectedSource(null);
    setSelectedOutput(null);
    setShowFeedback(false);
    setIsTransforming(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-green-900 hover:text-green-700">
          <ArrowLeft className="w-5 h-5" />
          Back to Missions
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-green-900 mb-2">Sources of Energy</h2>
          <p className="text-gray-600 mb-6">Level {level} of 3: Understanding Energy Transformation</p>

          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <h3 className="text-green-900 mb-3">The Challenge</h3>
            <p className="text-gray-700">
              {level === 1 && 'Learn how different energy sources can be converted to electrical energy, and then to other useful forms!'}
              {level === 2 && 'Explore more energy transformations and understand the path energy takes from source to output.'}
              {level === 3 && 'Master energy transformation by creating different combinations and understanding conservation of energy!'}
            </p>
          </div>

          {/* Energy Sources */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4">Step 1: Select Energy Source</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(energySources).map(([key, source]) => {
                const Icon = source.icon;
                const isSelected = selectedSource === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedSource(key as EnergySource);
                      setShowFeedback(false);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `${source.bgColor} border-green-500 scale-105`
                        : 'bg-white border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <Icon className={`w-12 h-12 mx-auto mb-2 ${source.color}`} />
                    <p className="text-sm">{source.name}</p>
                  </button>
                );
              })}
            </div>
            {selectedSource && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{energySources[selectedSource].description}</p>
              </div>
            )}
          </div>

          {/* Energy Flow Visualization */}
          <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-300">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                {selectedSource ? (
                  <>
                    {energySources[selectedSource].icon && (
                      <div className={energySources[selectedSource].color}>
                        {(() => {
                          const Icon = energySources[selectedSource].icon;
                          return <Icon className="w-16 h-16 mx-auto mb-2" />;
                        })()}
                      </div>
                    )}
                    <p className="text-sm text-gray-700">{energySources[selectedSource].input}</p>
                  </>
                ) : (
                  <div className="w-16 h-16 mx-auto mb-2 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">?</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="relative">
                  <div className={`text-4xl ${isTransforming ? 'animate-pulse' : ''}`}>
                    {isTransforming ? '⚡⚡⚡' : '→ ⚡ →'}
                  </div>
                  <p className="text-xs text-center text-gray-600 mt-2">Electrical Energy</p>
                </div>
              </div>

              <div className="text-center flex-1">
                {selectedOutput ? (
                  <>
                    <div className="text-6xl mb-2">
                      {energyOutputs[selectedOutput].icon}
                    </div>
                    <p className="text-sm text-gray-700">{energyOutputs[selectedOutput].name}</p>
                  </>
                ) : (
                  <div className="w-16 h-16 mx-auto mb-2 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">?</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Energy Outputs */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4">Step 2: Select Output Device</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(energyOutputs).map(([key, output]) => {
                const isSelected = selectedOutput === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedOutput(key as EnergyOutput);
                      setShowFeedback(false);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-green-100 border-green-500 scale-105'
                        : 'bg-white border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <div className="text-4xl mb-2">{output.icon}</div>
                    <p className="text-sm">{output.name}</p>
                  </button>
                );
              })}
            </div>
            {selectedOutput && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{energyOutputs[selectedOutput].description}</p>
              </div>
            )}
          </div>

          <button
            onClick={transformEnergy}
            disabled={!selectedSource || !selectedOutput}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed mb-6"
          >
            ⚡ Transform Energy!
          </button>

          {/* Feedback */}
          {showFeedback && (
            <div className={`rounded-xl p-6 mb-6 ${
              feedback.includes('Complete') 
                ? 'bg-green-100 border-2 border-green-500' 
                : 'bg-orange-100 border-2 border-orange-500'
            }`}>
              <h3 className={feedback.includes('Complete') ? 'text-green-900' : 'text-orange-900'}>
                {feedback.includes('Complete') ? '✅ Energy Transformation!' : 'ℹ️ Notice'}
              </h3>
              <p className="text-gray-700 mt-2 whitespace-pre-line">{feedback}</p>
              {feedback.includes('Complete') && level < 3 && (
                <button
                  onClick={nextLevel}
                  className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                >
                  Next Level
                </button>
              )}
              {feedback.includes('Complete') && level === 3 && (
                <p className="mt-4 text-green-900">🏆 Mission Complete! You understand energy transformation!</p>
              )}
            </div>
          )}

          {/* Educational Content */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-xl p-6">
              <h3 className="text-indigo-900 mb-3">Forms of Energy</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <span className="text-indigo-700">Light Energy:</span> From the sun, bulbs</li>
                <li>• <span className="text-indigo-700">Heat Energy:</span> From fire, heaters</li>
                <li>• <span className="text-indigo-700">Kinetic Energy:</span> Energy of motion</li>
                <li>• <span className="text-indigo-700">Electrical Energy:</span> From batteries, power plants</li>
                <li>• <span className="text-indigo-700">Chemical Energy:</span> In food, batteries</li>
                <li>• <span className="text-indigo-700">Sound Energy:</span> From speakers, drums</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-purple-900 mb-3">Energy in Daily Life</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <span className="text-purple-700">Solar Panels:</span> Power homes with sunlight</li>
                <li>• <span className="text-purple-700">Wind Turbines:</span> Generate electricity from wind</li>
                <li>• <span className="text-purple-700">Hydroelectric Dams:</span> Use water flow for power</li>
                <li>• <span className="text-purple-700">Food:</span> Gives us energy to move and grow</li>
                <li>• <span className="text-purple-700">Renewable Energy:</span> Won't run out (sun, wind, water)</li>
              </ul>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
          >
            Try Another Combination
          </button>
        </div>
      </div>
    </div>
  );
}
