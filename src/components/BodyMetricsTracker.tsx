import React, { useState, useEffect } from 'react';
import { BodyMetric } from '../types';
import * as db from '../services/db';
import { BodyMetricsChart } from './BodyMetricsChart';

interface BodyMetricsTrackerProps {
  isDarkMode?: boolean;
}

export const BodyMetricsTracker: React.FC<BodyMetricsTrackerProps> = ({ isDarkMode = true }) => {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [weight, setWeight] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchMetrics = async () => {
    const allMetrics = await db.getAllBodyMetrics();
    setMetrics(allMetrics);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const calculateBodyFat = (weight: number, muscleMass: number): number => {
    const fatMass = weight - muscleMass;
    return (fatMass / weight) * 100;
  };

  const handleAddMetric = async () => {
    if (!weight || !muscleMass) {
      alert('Por favor completa peso y masa muscular');
      return;
    }

    const weightNum = parseFloat(weight);
    const muscleMassNum = parseFloat(muscleMass);

    if (muscleMassNum >= weightNum) {
      alert('La masa muscular no puede ser igual o mayor al peso total');
      return;
    }

    const bodyFatPercentage = calculateBodyFat(weightNum, muscleMassNum);

    const newMetric = {
      date: selectedDate,
      weight: weightNum,
      muscleMass: muscleMassNum,
      bodyFatPercentage,
    };

    try {
      await db.addBodyMetric(newMetric);
      setWeight('');
      setMuscleMass('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      await fetchMetrics();
    } catch (error) {
      console.error('Error adding metric:', error);
      alert('Error al guardar la métrica');
    }
  };

  const handleDeleteMetric = async (id: number) => {
    if (window.confirm('¿Eliminar esta métrica?')) {
      try {
        await db.deleteBodyMetric(id);
        await fetchMetrics();
      } catch (error) {
        console.error('Error deleting metric:', error);
        alert('Error al eliminar la métrica');
      }
    }
  };

  const bgColor = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const inputBg = isDarkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300';
  const buttonBg = isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
  const borderColor = isDarkMode ? '' : 'border border-slate-200';

  const todayMetric = metrics.find(m => m.date === selectedDate);

  return (
    <div className={`${bgColor} ${borderColor} p-6 rounded-lg shadow-xl transition-colors duration-300 space-y-6`}>
      <h2 className={`text-2xl font-bold ${textColor}`}>Seguimiento de Peso y Composición Corporal</h2>

      {/* Input section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${textColor}`}>Fecha</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${inputBg}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-semibold mb-2 ${textColor}`}>Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="80.5"
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${inputBg}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-semibold mb-2 ${textColor}`}>Masa Muscular (kg)</label>
          <input
            type="number"
            step="0.1"
            value={muscleMass}
            onChange={(e) => setMuscleMass(e.target.value)}
            placeholder="35.5"
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${inputBg}`}
          />
        </div>
        <div className="flex flex-col justify-end">
          <button
            onClick={handleAddMetric}
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition-all ${buttonBg} hover:scale-105`}
          >
            ➕ Registrar
          </button>
        </div>
      </div>

      {/* Current metric */}
      {todayMetric && (
        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'} p-4 rounded-lg border ${isDarkMode ? 'border-slate-600' : 'border-blue-200'}`}>
          <p className={`text-sm ${textColor}`}>
            📊 Hoy: <span className="font-semibold">{todayMetric.weight} kg</span> • 
            <span className="font-semibold"> {todayMetric.muscleMass} kg músculo</span> • 
            <span className="font-semibold"> {(todayMetric.bodyFatPercentage || 0).toFixed(1)}% grasa</span>
          </p>
        </div>
      )}

      {/* Chart */}
      <BodyMetricsChart metrics={metrics} isDarkMode={isDarkMode} />

      {/* Recent metrics list */}
      <div>
        <h3 className={`text-lg font-bold mb-3 ${textColor}`}>Histórico (últimas 10)</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[...metrics].reverse().slice(0, 10).map(metric => (
            <div 
              key={metric.id}
              className={`flex justify-between items-center p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}
            >
              <div className={textColor}>
                <span className="font-semibold">{metric.date}</span>
                <span className="mx-2">|</span>
                <span>{metric.weight} kg</span>
                <span className="mx-2">|</span>
                <span>{metric.muscleMass} kg músculo</span>
                <span className="mx-2">|</span>
                <span>{(metric.bodyFatPercentage || 0).toFixed(1)}% grasa</span>
              </div>
              <button
                onClick={() => handleDeleteMetric(metric.id)}
                className="text-red-500 hover:text-red-700 font-semibold transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
