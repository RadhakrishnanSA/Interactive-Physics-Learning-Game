import { useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';

interface Component {
  id: string;
  type: 'battery' | 'bulb' | 'switch' | 'wire';
  connected: boolean;
}

interface CircuitMissionProps {
  onBack: () => void;
  onComplete: () => void;
}

export function CircuitMission({ onBack, onComplete }: CircuitMissionProps) {
  const [level, setLevel] = useState(1);
  const [hasBattery, setHasBattery] = useState(false);
  const [hasBulb, setHasBulb] = useState(false);
  const [hasSwitch, setHasSwitch] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [circuitClosed, setCircuitClosed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const addComponent = (type: 'battery' | 'bulb' | 'switch') => {
    if (type === 'battery') setHasBattery(true);
    if (type === 'bulb') setHasBulb(true);
    if (type === 'switch') setHasSwitch(true);
    setShowFeedback(false);
  };

  const removeComponent = (type: 'battery' | 'bulb' | 'switch') => {
    if (type === 'battery') setHasBattery(false);
    if (type === 'bulb') setHasBulb(false);
    if (type === 'switch') {
      setHasSwitch(false);
      setSwitchOn(false);
    }
    setCircuitClosed(false);
    setShowFeedback(false);
  };

  const toggleSwitch = () => {
    setSwitchOn(!switchOn);
    setShowFeedback(false);
  };

  const testCircuit = () => {
    if (!hasBattery) {
      setFeedback('⚠️ You need a battery to provide electrical energy! A battery converts chemical energy into electrical energy, creating a flow of electrons (current).');
      setShowFeedback(true);
      setCircuitClosed(false);
      return;
    }

    if (!hasBulb) {
      setFeedback('⚠️ You need a bulb to complete the circuit! The bulb converts electrical energy into light energy when current flows through its filament.');
      setShowFeedback(true);
      setCircuitClosed(false);
      return;
    }

    if (level >= 2 && !hasSwitch) {
      setFeedback('⚠️ This level requires a switch! A switch is used to control whether the circuit is open (no current) or closed (current flows).');
      setShowFeedback(true);
      setCircuitClosed(false);
      return;
    }

    if (level >= 2 && hasSwitch && !switchOn) {
      setFeedback('💡 The switch is OFF! When the switch is open, it breaks the circuit path. No current can flow, so the bulb won\'t light up. Turn it ON to close the circuit.');
      setShowFeedback(true);
      setCircuitClosed(false);
      return;
    }

    // Circuit is complete and working
    setCircuitClosed(true);
    setFeedback(`✅ Circuit Complete! Current flows from the battery's positive terminal → through the ${level >= 2 ? 'closed switch → ' : ''}bulb → back to the negative terminal. The complete path allows electrons to flow continuously, lighting the bulb. This is a CLOSED CIRCUIT.`);
    setShowFeedback(true);

    if (level === 3) {
      onComplete();
    }
  };

  const nextLevel = () => {
    setLevel(l => l + 1);
    setHasBattery(false);
    setHasBulb(false);
    setHasSwitch(false);
    setSwitchOn(false);
    setCircuitClosed(false);
    setShowFeedback(false);
  };

  const reset = () => {
    setHasBattery(false);
    setHasBulb(false);
    setHasSwitch(false);
    setSwitchOn(false);
    setCircuitClosed(false);
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-purple-900 hover:text-purple-700">
          <ArrowLeft className="w-5 h-5" />
          Back to Missions
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-purple-900 mb-2">Electricity & Circuits</h2>
          <p className="text-gray-600 mb-6">Level {level} of 3: Building and Understanding Circuits</p>

          <div className="bg-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-purple-900 mb-3">The Challenge</h3>
            <p className="text-gray-700">
              {level === 1 && 'Build a simple circuit to light up a bulb. You need a battery and a bulb connected in a closed loop.'}
              {level === 2 && 'Add a switch to your circuit to control when the bulb lights up. This lets you open or close the circuit.'}
              {level === 3 && 'Build a complete circuit with all components and explain how current flows!'}
            </p>
          </div>

          {/* Component Selection */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4">Available Components</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => hasBattery ? removeComponent('battery') : addComponent('battery')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  hasBattery 
                    ? 'bg-purple-500 text-white border-purple-600' 
                    : 'bg-white border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="text-4xl mb-2">🔋</div>
                <p className="text-sm">Battery</p>
              </button>
              <button
                onClick={() => hasBulb ? removeComponent('bulb') : addComponent('bulb')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  hasBulb 
                    ? 'bg-purple-500 text-white border-purple-600' 
                    : 'bg-white border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="text-4xl mb-2">💡</div>
                <p className="text-sm">Bulb</p>
              </button>
              <button
                onClick={() => hasSwitch ? removeComponent('switch') : addComponent('switch')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  hasSwitch 
                    ? 'bg-purple-500 text-white border-purple-600' 
                    : 'bg-white border-gray-300 hover:border-purple-400'
                }`}
                disabled={level < 2}
              >
                <div className="text-4xl mb-2">🔘</div>
                <p className="text-sm">Switch</p>
                {level < 2 && <p className="text-xs mt-1">(Level 2+)</p>}
              </button>
            </div>
          </div>

          {/* Circuit Visualization */}
          <div className="relative h-80 bg-gray-100 rounded-xl mb-6 overflow-hidden border-2 border-gray-300">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Wires - only show if components are present */}
              {hasBattery && hasBulb && (
                <>
                  {/* Top wire */}
                  <line x1="100" y1="150" x2="300" y2="150" 
                    stroke={circuitClosed ? "#f59e0b" : "#9ca3af"} 
                    strokeWidth="4"
                    className={circuitClosed ? "animate-pulse" : ""}
                  />
                  {/* Bottom wire */}
                  <line x1="100" y1="150" x2="100" y2="220" 
                    stroke={circuitClosed ? "#f59e0b" : "#9ca3af"} 
                    strokeWidth="4"
                  />
                  <line x1="100" y1="220" x2="300" y2="220" 
                    stroke={circuitClosed ? "#f59e0b" : "#9ca3af"} 
                    strokeWidth="4"
                  />
                  <line x1="300" y1="150" x2="300" y2="220" 
                    stroke={circuitClosed ? "#f59e0b" : "#9ca3af"} 
                    strokeWidth="4"
                  />
                  
                  {/* Current flow indicators */}
                  {circuitClosed && (
                    <>
                      <circle cx="150" cy="150" r="3" fill="#f59e0b">
                        <animate attributeName="cx" from="100" to="300" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="250" cy="150" r="3" fill="#f59e0b">
                        <animate attributeName="cx" from="100" to="300" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                </>
              )}

              {/* Battery */}
              {hasBattery && (
                <g transform="translate(80, 120)">
                  <rect x="0" y="0" width="40" height="60" fill="#1e293b" rx="4" />
                  <rect x="15" y="-8" width="10" height="8" fill="#1e293b" />
                  <text x="20" y="35" fill="white" fontSize="24" textAnchor="middle">+</text>
                  <text x="5" y="15" fill="#ef4444" fontSize="12">+</text>
                  <text x="5" y="55" fill="#3b82f6" fontSize="12">-</text>
                </g>
              )}

              {/* Bulb */}
              {hasBulb && (
                <g transform="translate(260, 130)">
                  <circle cx="20" cy="20" r="20" fill={circuitClosed ? "#fbbf24" : "#e5e7eb"} stroke="#9ca3af" strokeWidth="2" />
                  {circuitClosed && (
                    <>
                      <line x1="10" y1="10" x2="30" y2="30" stroke="#fff" strokeWidth="2" />
                      <line x1="30" y1="10" x2="10" y2="30" stroke="#fff" strokeWidth="2" />
                      <circle cx="20" cy="20" r="20" fill="#fbbf24" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  <rect x="10" y="40" width="20" height="10" fill="#94a3b8" />
                </g>
              )}

              {/* Switch */}
              {hasSwitch && (
                <g transform="translate(180, 135)">
                  <circle cx="0" cy="10" r="5" fill="#64748b" />
                  <circle cx="40" cy="10" r="5" fill="#64748b" />
                  <line 
                    x1="5" 
                    y1="10" 
                    x2={switchOn ? "35" : "35"} 
                    y2={switchOn ? "10" : "0"} 
                    stroke="#64748b" 
                    strokeWidth="3" 
                  />
                  <text x="20" y="-10" fontSize="12" fill="#64748b" textAnchor="middle">
                    {switchOn ? "ON" : "OFF"}
                  </text>
                </g>
              )}
            </svg>

            {/* Instructions overlay */}
            {!hasBattery && !hasBulb && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <p className="text-gray-600">Select components above to build your circuit</p>
              </div>
            )}
          </div>

          {/* Switch Control */}
          {hasSwitch && (
            <div className="mb-6">
              <button
                onClick={toggleSwitch}
                className={`w-full py-3 rounded-xl transition-all ${
                  switchOn 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                <Zap className="inline-block w-5 h-5 mr-2" />
                Switch: {switchOn ? 'ON (Circuit Closed)' : 'OFF (Circuit Open)'}
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={testCircuit}
              className="flex-1 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600"
            >
              Test Circuit
            </button>
            <button
              onClick={reset}
              className="bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600"
            >
              Reset
            </button>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`rounded-xl p-6 mb-6 ${
              circuitClosed 
                ? 'bg-green-100 border-2 border-green-500' 
                : 'bg-orange-100 border-2 border-orange-500'
            }`}>
              <h3 className={circuitClosed ? 'text-green-900' : 'text-orange-900'}>
                {circuitClosed ? '✅ Success!' : 'ℹ️ Information'}
              </h3>
              <p className="text-gray-700 mt-2">{feedback}</p>
              {circuitClosed && level < 3 && (
                <button
                  onClick={nextLevel}
                  className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                >
                  Next Level
                </button>
              )}
              {circuitClosed && level === 3 && (
                <p className="mt-4 text-green-900">🏆 Mission Complete! You understand circuits and current flow!</p>
              )}
            </div>
          )}

          {/* Educational Content */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-indigo-900 mb-3">How Circuits Work</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="text-indigo-700">• Closed Circuit:</span> Current can flow because there's a complete path. The bulb lights up.
              </p>
              <p>
                <span className="text-indigo-700">• Open Circuit:</span> The path is broken (by an open switch or missing component). No current flows.
              </p>
              <p>
                <span className="text-indigo-700">• Current Flow:</span> Electrons flow from the negative terminal, through the circuit, to the positive terminal.
              </p>
              <p>
                <span className="text-indigo-700">• Energy Conversion:</span> Battery (chemical → electrical) → Bulb (electrical → light + heat)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
