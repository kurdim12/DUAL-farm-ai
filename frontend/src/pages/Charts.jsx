import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { sensorAPI } from '../services/api';

const Charts = () => {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState('1h');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await sensorAPI.getHistory(timeRange, 500);
      // Reverse to show chronological order
      const readings = response.data.reverse();

      // Format data for charts
      const formatted = readings.map((reading) => ({
        timestamp: new Date(reading.timestamp).toLocaleTimeString(),
        tds: reading.tds_ppm,
        temperature: reading.temperature_c,
        waterLevel: reading.water_level_cm,
        ph: reading.ph_value,
      }));

      setData(formatted);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner text="Loading charts..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Live Charts</h1>
          <p className="text-gray-600 mt-1">Real-time sensor data visualization</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {['1h', '24h', '7d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-800 text-sm">
          🔄 Auto-refreshing every 5 seconds • Showing last {timeRange} • {data.length} readings
        </p>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* TDS Chart */}
        <Card title="TDS (Total Dissolved Solids)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis label={{ value: 'TDS (ppm)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="tds"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="TDS (ppm)"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-around text-sm">
            <div className="text-center">
              <p className="text-gray-600">Optimal Range</p>
              <p className="font-bold text-green-600">600 - 900 ppm</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Min Threshold</p>
              <p className="font-bold text-yellow-600">500 ppm</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Max Threshold</p>
              <p className="font-bold text-red-600">1100 ppm</p>
            </div>
          </div>
        </Card>

        {/* Temperature Chart */}
        <Card title="Temperature">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-around text-sm">
            <div className="text-center">
              <p className="text-gray-600">Optimal Range</p>
              <p className="font-bold text-blue-600">20 - 28°C</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Min Threshold</p>
              <p className="font-bold text-yellow-600">15°C</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Max Threshold</p>
              <p className="font-bold text-red-600">35°C</p>
            </div>
          </div>
        </Card>

        {/* Water Level Chart */}
        <Card title="Water Level">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis label={{ value: 'Water Level (cm)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="waterLevel"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Water Level (cm)"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-around text-sm">
            <div className="text-center">
              <p className="text-gray-600">Safe Range</p>
              <p className="font-bold text-purple-600">&gt; 30 cm</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Low Threshold</p>
              <p className="font-bold text-red-600">10 cm</p>
            </div>
          </div>
        </Card>

        {/* pH Chart (if available) */}
        {data.some((d) => d.ph !== null) && (
          <Card title="pH Level">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 14]}
                  label={{ value: 'pH', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ph"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="pH"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-around text-sm">
              <div className="text-center">
                <p className="text-gray-600">Optimal Range</p>
                <p className="font-bold text-yellow-600">5.5 - 6.5</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Charts;
