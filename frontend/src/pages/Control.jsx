import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { controlAPI, sensorAPI } from '../services/api';

const Control = () => {
  const [latest, setLatest] = useState(null);
  const [doseAmount, setDoseAmount] = useState(50);
  const [pumpReason, setPumpReason] = useState('');
  const [doseReason, setDoseReason] = useState('');
  const [showPumpConfirm, setShowPumpConfirm] = useState(false);
  const [showDoseConfirm, setShowDoseConfirm] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchLatest = async () => {
    try {
      const response = await sensorAPI.getLatest();
      setLatest(response.data);
    } catch (error) {
      console.error('Error fetching latest reading:', error);
    }
  };

  useEffect(() => {
    fetchLatest();
    const interval = setInterval(fetchLatest, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePumpControl = async (state) => {
    try {
      await controlAPI.controlPump(state, pumpReason || undefined);
      setMessage({
        type: 'success',
        text: `Pump turned ${state} successfully!`,
      });
      setShowPumpConfirm(false);
      setPumpReason('');
      fetchLatest();
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error controlling pump: ${error.message}`,
      });
    }
  };

  const handleDoseNutrients = async () => {
    try {
      await controlAPI.doseNutrients(doseAmount, doseReason || undefined);
      setMessage({
        type: 'success',
        text: `Dosed ${doseAmount}ml of nutrients successfully!`,
      });
      setShowDoseConfirm(false);
      setDoseReason('');
      fetchLatest();
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error dosing nutrients: ${error.message}`,
      });
    }
  };

  const currentPumpState = latest?.pump_state || 'OFF';
  const nextPumpState = currentPumpState === 'ON' ? 'OFF' : 'ON';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Control Panel</h1>
        <p className="text-gray-600 mt-1">
          Manage pump and nutrient dosing operations
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <p className="font-medium">{message.text}</p>
          <button
            onClick={() => setMessage(null)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Current Status */}
      {latest && (
        <Card title="Current System Status" className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">TDS Level</p>
              <p className="text-2xl font-bold text-green-600">
                {latest.tds_ppm.toFixed(1)} <span className="text-sm">ppm</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-2xl font-bold text-blue-600">
                {latest.temperature_c.toFixed(1)} <span className="text-sm">°C</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Water Level</p>
              <p className="text-2xl font-bold text-purple-600">
                {latest.water_level_cm.toFixed(1)} <span className="text-sm">cm</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pump Status</p>
              <p
                className={`text-2xl font-bold ${
                  currentPumpState === 'ON' ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                {currentPumpState}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pump Control */}
        <Card title="⚙️ Pump Control">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Status:</p>
              <div
                className={`inline-block px-4 py-2 rounded-lg font-bold ${
                  currentPumpState === 'ON'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {currentPumpState}
              </div>
            </div>

            {!showPumpConfirm ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={pumpReason}
                    onChange={(e) => setPumpReason(e.target.value)}
                    placeholder="e.g., Routine circulation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setShowPumpConfirm(true)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    nextPumpState === 'ON'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Turn Pump {nextPumpState}
                </button>
              </>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <p className="font-bold text-yellow-800 mb-2">⚠️ Confirm Action</p>
                <p className="text-sm text-yellow-700 mb-4">
                  Are you sure you want to turn the pump {nextPumpState}?
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePumpControl(nextPumpState)}
                    className="flex-1 bg-primary hover:bg-green-600 text-white py-2 rounded-md font-medium"
                  >
                    ✓ Confirm
                  </button>
                  <button
                    onClick={() => setShowPumpConfirm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md font-medium"
                  >
                    ✗ Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Pump Operation Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Run pump periodically to circulate nutrients</li>
                <li>Avoid running continuously for &gt;30 minutes</li>
                <li>Turn off during maintenance</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Nutrient Dosing */}
        <Card title="💧 Nutrient Dosing">
          <div className="space-y-4">
            {latest && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Current TDS:</p>
                <p className="text-2xl font-bold text-green-600">
                  {latest.tds_ppm.toFixed(1)} ppm
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Optimal: 600-900 ppm
                </p>
              </div>
            )}

            {!showDoseConfirm ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (ml)
                  </label>
                  <input
                    type="number"
                    value={doseAmount}
                    onChange={(e) => setDoseAmount(Number(e.target.value))}
                    min="1"
                    max="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Est. TDS increase: ~{((doseAmount / 10) * 50).toFixed(0)} ppm
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={doseReason}
                    onChange={(e) => setDoseReason(e.target.value)}
                    placeholder="e.g., TDS below threshold"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setShowDoseConfirm(true)}
                  className="w-full bg-primary hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Dose Nutrients
                </button>
              </>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <p className="font-bold text-yellow-800 mb-2">⚠️ Confirm Dosing</p>
                <p className="text-sm text-yellow-700 mb-2">
                  You are about to dose <strong>{doseAmount}ml</strong> of nutrients.
                </p>
                <p className="text-xs text-yellow-600 mb-4">
                  This will increase TDS by approximately{' '}
                  {((doseAmount / 10) * 50).toFixed(0)} ppm
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDoseNutrients}
                    className="flex-1 bg-primary hover:bg-green-600 text-white py-2 rounded-md font-medium"
                  >
                    ✓ Confirm
                  </button>
                  <button
                    onClick={() => setShowDoseConfirm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md font-medium"
                  >
                    ✗ Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Dosing Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Dose when TDS drops below 500 ppm</li>
                <li>Start with small amounts (20-50ml)</li>
                <li>Wait 10-15 minutes before re-dosing</li>
                <li>Do not exceed 1100 ppm TDS</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Safety Notice */}
      <div className="mt-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
        <p className="font-bold text-red-800 mb-2">⚠️ Safety Notice</p>
        <p className="text-sm text-red-700">
          This control panel directly affects the farming system. Always double-check
          readings before making adjustments. In production, implement proper safety
          interlocks and automated control logic.
        </p>
      </div>
    </div>
  );
};

export default Control;
