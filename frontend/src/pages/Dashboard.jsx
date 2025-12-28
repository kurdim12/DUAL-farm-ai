import React, { useState, useEffect } from 'react';
import { Card, StatCard } from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyticsAPI, sensorAPI, simulationAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [simStatus, setSimStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dashboardRes, simRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        simulationAPI.getStatus(),
      ]);
      setStats(dashboardRes.data);
      setSimStatus(simRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleToggleSimulation = async () => {
    try {
      if (simStatus?.running) {
        await simulationAPI.stop();
      } else {
        await simulationAPI.start();
      }
      fetchData();
    } catch (error) {
      console.error('Error toggling simulation:', error);
    }
  };

  if (loading || !stats) {
    return (
      <div className="p-8">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  const latest = stats.latest_reading;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time farming system overview</p>
        </div>

        {/* Simulation Control */}
        <button
          onClick={handleToggleSimulation}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            simStatus?.running
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-primary hover:bg-green-600 text-white'
          }`}
        >
          {simStatus?.running ? '⏹ Stop Simulation' : '▶ Start Simulation'}
        </button>
      </div>

      {/* Simulation Status */}
      {simStatus?.running && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ✅ Simulation Running - Auto-generating sensor data every 5 seconds
          </p>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="TDS Level"
          value={latest?.tds_ppm?.toFixed(1) || 'N/A'}
          unit="ppm"
          icon="💧"
          color={
            latest?.tds_ppm < 500
              ? 'warning'
              : latest?.tds_ppm > 1100
              ? 'danger'
              : 'primary'
          }
        />
        <StatCard
          title="Temperature"
          value={latest?.temperature_c?.toFixed(1) || 'N/A'}
          unit="°C"
          icon="🌡️"
          color={
            latest?.temperature_c < 15 || latest?.temperature_c > 35
              ? 'warning'
              : 'secondary'
          }
        />
        <StatCard
          title="Water Level"
          value={latest?.water_level_cm?.toFixed(1) || 'N/A'}
          unit="cm"
          icon="📊"
          color={latest?.water_level_cm < 10 ? 'danger' : 'primary'}
        />
        <StatCard
          title="Pump Status"
          value={latest?.pump_state || 'N/A'}
          icon="⚙️"
          color={latest?.pump_state === 'ON' ? 'secondary' : 'primary'}
        />
      </div>

      {/* 24-Hour Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Active Alerts" className="text-center">
          <p className="text-4xl font-bold text-red-600">
            {stats.active_alerts_count}
          </p>
          <p className="text-sm text-gray-600 mt-2">Unresolved issues</p>
        </Card>
        <Card title="Avg TDS (24h)" className="text-center">
          <p className="text-4xl font-bold text-green-600">
            {stats.avg_tds_24h?.toFixed(0) || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-2">Parts per million</p>
        </Card>
        <Card title="Pump Runtime (24h)" className="text-center">
          <p className="text-4xl font-bold text-blue-600">
            {stats.pump_runtime_minutes_24h?.toFixed(1) || '0'}
          </p>
          <p className="text-sm text-gray-600 mt-2">Minutes</p>
        </Card>
        <Card title="Total Doses (24h)" className="text-center">
          <p className="text-4xl font-bold text-purple-600">
            {stats.total_doses_24h}
          </p>
          <p className="text-sm text-gray-600 mt-2">Nutrient applications</p>
        </Card>
      </div>

      {/* Latest Reading Details */}
      {latest && (
        <Card title="Latest Sensor Reading">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Timestamp</p>
              <p className="font-medium">
                {new Date(latest.timestamp).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Source</p>
              <p className="font-medium capitalize">{latest.source}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">pH Value</p>
              <p className="font-medium">
                {latest.ph_value?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600">Note</p>
              <p className="font-medium">{latest.note || 'No notes'}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="System Health">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Readings (24h)</span>
              <span className="font-bold">{stats.total_readings_24h}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Avg Temperature (24h)</span>
              <span className="font-bold">
                {stats.avg_temp_24h?.toFixed(1) || 'N/A'}°C
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Avg Water Level (24h)</span>
              <span className="font-bold">
                {stats.avg_water_level_24h?.toFixed(1) || 'N/A'} cm
              </span>
            </div>
          </div>
        </Card>

        <Card title="Status Indicators">
          <div className="space-y-3">
            <StatusIndicator
              label="TDS Range"
              status={
                latest?.tds_ppm >= 500 && latest?.tds_ppm <= 1100
                  ? 'good'
                  : 'warning'
              }
            />
            <StatusIndicator
              label="Temperature Range"
              status={
                latest?.temperature_c >= 15 && latest?.temperature_c <= 35
                  ? 'good'
                  : 'warning'
              }
            />
            <StatusIndicator
              label="Water Level"
              status={latest?.water_level_cm >= 10 ? 'good' : 'critical'}
            />
            <StatusIndicator
              label="Alert Status"
              status={stats.active_alerts_count === 0 ? 'good' : 'warning'}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatusIndicator = ({ label, status }) => {
  const colors = {
    good: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    critical: 'bg-red-100 text-red-800 border-red-300',
  };

  const icons = {
    good: '✓',
    warning: '⚠',
    critical: '✗',
  };

  return (
    <div
      className={`flex items-center justify-between p-2 rounded border ${colors[status]}`}
    >
      <span className="font-medium">{label}</span>
      <span className="text-xl">{icons[status]}</span>
    </div>
  );
};

export default Dashboard;
