import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyticsAPI, sensorAPI, actionAPI, alertAPI } from '../services/api';

const Reports = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await analyticsAPI.getInsights();
        setInsights(response.data);
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
    const interval = setInterval(fetchInsights, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const exportCSV = async (type) => {
    try {
      let data = [];
      let filename = '';
      let headers = [];

      if (type === 'sensors') {
        const response = await sensorAPI.getHistory('7d', 5000);
        data = response.data;
        filename = 'sensor_readings.csv';
        headers = [
          'Timestamp',
          'TDS (ppm)',
          'Temperature (°C)',
          'pH',
          'Water Level (cm)',
          'Pump State',
          'Source',
          'Note',
        ];

        const csvContent = [
          headers.join(','),
          ...data.map((row) =>
            [
              new Date(row.timestamp).toISOString(),
              row.tds_ppm,
              row.temperature_c,
              row.ph_value || '',
              row.water_level_cm,
              row.pump_state,
              row.source,
              `"${row.note || ''}"`,
            ].join(',')
          ),
        ].join('\n');

        downloadCSV(csvContent, filename);
      } else if (type === 'actions') {
        const response = await actionAPI.getHistory(5000);
        data = response.data;
        filename = 'action_logs.csv';
        headers = [
          'Timestamp',
          'Action Type',
          'Amount (ml)',
          'Reason',
          'Automated',
          'TDS Before',
          'TDS After',
        ];

        const csvContent = [
          headers.join(','),
          ...data.map((row) =>
            [
              new Date(row.timestamp).toISOString(),
              row.action_type,
              row.amount_ml || '',
              `"${row.reason || ''}"`,
              row.automated,
              row.tds_before || '',
              row.tds_after || '',
            ].join(',')
          ),
        ].join('\n');

        downloadCSV(csvContent, filename);
      } else if (type === 'alerts') {
        const response = await alertAPI.getHistory(5000);
        data = response.data;
        filename = 'alerts.csv';
        headers = [
          'Timestamp',
          'Alert Type',
          'Severity',
          'Message',
          'Resolved',
          'Resolved At',
        ];

        const csvContent = [
          headers.join(','),
          ...data.map((row) =>
            [
              new Date(row.timestamp).toISOString(),
              row.alert_type,
              row.severity,
              `"${row.message}"`,
              row.resolved,
              row.resolved_at ? new Date(row.resolved_at).toISOString() : '',
            ].join(',')
          ),
        ].join('\n');

        downloadCSV(csvContent, filename);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner text="Loading insights..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Insights</h1>
        <p className="text-gray-600 mt-1">
          AI-powered insights and data export for analysis
        </p>
      </div>

      {/* AI Insights */}
      <Card title="🤖 AI Insights" className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Heuristic-based analysis of your farming data (MVP - can be enhanced with ML
          models)
        </p>

        {insights.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Not enough data to generate insights yet. Keep monitoring!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        )}
      </Card>

      {/* Data Export */}
      <Card title="📊 Data Export" className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Export data for external analysis, reporting, or RoboCraft documentation
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => exportCSV('sensors')}
            className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
          >
            📥 Export Sensor Readings
            <p className="text-sm font-normal mt-1">CSV format (7 days)</p>
          </button>

          <button
            onClick={() => exportCSV('actions')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
          >
            📥 Export Action Logs
            <p className="text-sm font-normal mt-1">CSV format (all time)</p>
          </button>

          <button
            onClick={() => exportCSV('alerts')}
            className="bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
          >
            📥 Export Alerts
            <p className="text-sm font-normal mt-1">CSV format (all time)</p>
          </button>
        </div>
      </Card>

      {/* RoboCraft Report Summary */}
      <Card title="📋 RoboCraft Report Summary">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">System Features & Capabilities</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Real-time Monitoring:</strong> Continuous tracking of TDS, temperature,
                pH, and water level with sub-second updates
              </li>
              <li>
                <strong>Intelligent Alerts:</strong> Rule-based alert system that notifies when
                parameters exceed safe thresholds (TDS, temperature, water level)
              </li>
              <li>
                <strong>Remote Control:</strong> Web-based control panel for pump operation and
                nutrient dosing with safety confirmations
              </li>
              <li>
                <strong>Data Visualization:</strong> Interactive charts showing historical
                trends and patterns using Recharts library
              </li>
              <li>
                <strong>AI Insights:</strong> Heuristic-based analysis detecting trends,
                anomalies, and providing actionable recommendations
              </li>
              <li>
                <strong>Action Logging:</strong> Complete audit trail of all manual and
                automated interventions
              </li>
              <li>
                <strong>Data Export:</strong> CSV export functionality for external analysis and
                reporting
              </li>
              <li>
                <strong>Simulation Mode:</strong> Built-in data generator for demonstration and
                testing without physical sensors
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Impact & Benefits</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Reduced Labor:</strong> Automated monitoring eliminates need for manual
                readings every few hours
              </li>
              <li>
                <strong>Early Problem Detection:</strong> Instant alerts prevent crop damage
                from parameter deviations
              </li>
              <li>
                <strong>Optimized Resource Use:</strong> Data-driven decisions reduce nutrient
                waste and water consumption
              </li>
              <li>
                <strong>Scalability:</strong> Web-based architecture allows monitoring from
                anywhere with internet
              </li>
              <li>
                <strong>Data-Driven Farming:</strong> Historical data enables optimization of
                growing conditions over time
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Backend:</p>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Python FastAPI</li>
                  <li>SQLite + SQLAlchemy</li>
                  <li>RESTful API</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Frontend:</p>
                <ul className="list-disc list-inside text-gray-600">
                  <li>React + Vite</li>
                  <li>Tailwind CSS</li>
                  <li>Recharts</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-bold text-blue-800 mb-2">💡 For RoboCraft Report:</p>
            <p className="text-sm text-blue-700">
              Include screenshots of: Dashboard overview, Live charts, Control panel in
              action, Active alerts, and AI insights. Export CSV files to demonstrate data
              collection capabilities. Highlight the simulation mode for reproducible
              demonstrations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const InsightCard = ({ insight }) => {
  const typeColors = {
    TREND: 'bg-blue-50 border-blue-300 text-blue-800',
    ANOMALY: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    RECOMMENDATION: 'bg-green-50 border-green-300 text-green-800',
    INFO: 'bg-gray-50 border-gray-300 text-gray-800',
  };

  const typeIcons = {
    TREND: '📈',
    ANOMALY: '⚠️',
    RECOMMENDATION: '💡',
    INFO: 'ℹ️',
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${typeColors[insight.insight_type]}`}>
      <div className="flex items-start space-x-3">
        <span className="text-3xl">{typeIcons[insight.insight_type]}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg">{insight.title}</h4>
            <span className="text-sm font-medium">
              {(insight.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
          <p className="text-sm">{insight.description}</p>
          <p className="text-xs mt-2 opacity-75">
            {new Date(insight.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
