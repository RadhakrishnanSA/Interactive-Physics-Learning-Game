import { useState } from 'react';
import { BookOpen, Zap, Magnet, Thermometer, Sun, Wind, Lightbulb } from 'lucide-react';
import { MotionMission } from './components/MotionMission';
import { LightMission } from './components/LightMission';
import { CircuitMission } from './components/CircuitMission';
import { MagnetismMission } from './components/MagnetismMission';
import { HeatMission } from './components/HeatMission';
import { EnergyMission } from './components/EnergyMission';
import { AirMission } from './components/AirMission';

type Mission = 'menu' | 'motion' | 'light' | 'circuit' | 'magnetism' | 'heat' | 'energy' | 'air';

const missions = [
  {
    id: 'motion' as Mission,
    title: 'Motion & Measurement',
    icon: BookOpen,
    description: 'Learn about distance, time, and speed',
    color: 'bg-blue-500',
  },
  {
    id: 'light' as Mission,
    title: 'Light & Shadows',
    icon: Lightbulb,
    description: 'Explore reflection, shadows, and mirrors',
    color: 'bg-yellow-500',
  },
  {
    id: 'circuit' as Mission,
    title: 'Electricity & Circuits',
    icon: Zap,
    description: 'Build circuits and understand current flow',
    color: 'bg-purple-500',
  },
  {
    id: 'magnetism' as Mission,
    title: 'Magnetism',
    icon: Magnet,
    description: 'Discover attraction and repulsion',
    color: 'bg-red-500',
  },
  {
    id: 'heat' as Mission,
    title: 'Heat',
    icon: Thermometer,
    description: 'Understand temperature and heat transfer',
    color: 'bg-orange-500',
  },
  {
    id: 'energy' as Mission,
    title: 'Sources of Energy',
    icon: Sun,
    description: 'Learn about energy transformation',
    color: 'bg-green-500',
  },
  {
    id: 'air' as Mission,
    title: 'Air Around Us',
    icon: Wind,
    description: 'Explore air pressure and properties',
    color: 'bg-cyan-500',
  },
];

export default function App() {
  const [currentMission, setCurrentMission] = useState<Mission>('menu');
  const [completedMissions, setCompletedMissions] = useState<Set<Mission>>(new Set());

  const handleMissionComplete = (missionId: Mission) => {
    setCompletedMissions(prev => new Set([...prev, missionId]));
  };

  const renderMission = () => {
    switch (currentMission) {
      case 'motion':
        return <MotionMission onBack={() => setCurrentMission('menu')} onComplete={() => handleMissionComplete('motion')} />;
      case 'light':
        return <LightMission onBack={() => setCurrentMission('menu')} onComplete={() => handleMissionComplete('light')} />;
      case 'circuit':
        return <CircuitMission onBack={() => setCurrentMission('menu')} onComplete={() => handleMissionComplete('circuit')} />;
      case 'magnetism':
        return <MagnetismMission onBack={() => setCurrentMission('menu')} onComplete={() => handleMissionComplete('magnetism')} />;
      case 'heat':
        return <HeatMission onBack={() => setCurrentMission('menu')} onComplete={() => handleMissionComplete('heat')} />;
      case 'energy':
        return <EnergyMission onBack={() => setCurrentMission('menu')} onComplete={() => handleMissionComplete('energy')} />;
      case 'air':
        return <AirMission onBack={() => setCurrentMission('menu')} onComplete={() => handleMissionComplete('air')} />;
      default:
        return null;
    }
  };

  if (currentMission !== 'menu') {
    return renderMission();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-indigo-900 mb-4">Physics Explorer</h1>
          <p className="text-gray-700 text-xl">Choose a mission to begin your physics adventure!</p>
          <div className="mt-4">
            <span className="text-indigo-700">
              Missions Completed: {completedMissions.size} / {missions.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const Icon = mission.icon;
            const isCompleted = completedMissions.has(mission.id);
            
            return (
              <button
                key={mission.id}
                onClick={() => setCurrentMission(mission.id)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-left relative overflow-hidden group"
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    ✓
                  </div>
                )}
                
                <div className={`${mission.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-gray-900 mb-2">{mission.title}</h3>
                <p className="text-gray-600">{mission.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>Each mission includes interactive experiments with instant feedback!</p>
        </div>
      </div>
    </div>
  );
}
