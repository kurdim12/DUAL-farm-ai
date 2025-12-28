import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { alertAPI } from '../services/api';

const Alerts = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('active'); // 'active' or 'history'

  const fetchData = async () => {
    try {
      const [activeRes, historyRes, statsRes] = await Promise.all([
        alertAPI.getActive(50),
        alertAPI.getHistory(100),
        alertAPI.getStats(),
      ]);

      setActiveAlerts(activeRes.data);
      setAlertHistory(historyRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (alertId) => {
    try {
      await alertAPI.resolve(alertId);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner text="Loading alerts..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Alert Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage system alerts</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">Active Alerts</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats.active}</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">Resolved</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.resolved}</p>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-700 font-medium">Critical</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">
              {stats.by_severity.CRITICAL}
            </p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">Total Alerts</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {stats.total_alerts}
            </p>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setView('active')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            view === 'active'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active Alerts ({activeAlerts.length})
        </button>
        <button
          onClick={() => setView('history')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            view === 'history'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Alert History ({alertHistory.length})
        </button>
      </div>

      {/* Alerts List */}
      {view === 'active' ? (
        <div className="space-y-4">
          {activeAlerts.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-6xl mb-4">✅</p>
                <p className="text-xl font-semibold text-green-600">
                  No Active Alerts
                </p>
                <p className="text-gray-600 mt-2">
                  All systems are operating within normal parameters
                </p>
              </div>
            </Card>
          ) : (
            activeAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onResolve={handleResolve}
                showResolve={true}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {alertHistory.map((alert) => (
            <AlertCard key={alert.id} alert={alert} showResolve={false} />
          ))}
        </div>
      )}

      {/* Alert Type Breakdown */}
      {stats && (
        <Card title="Alert Type Breakdown" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.by_type).map(([type, count]) => (
              <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{formatAlertType(type)}</p>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

const AlertCard = ({ alert, onResolve, showResolve }) => {
  const severityColors = {
    CRITICAL: 'bg-red-50 border-red-300 text-red-800',
    WARNING: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    INFO: 'bg-blue-50 border-blue-300 text-blue-800',
  };

  const severityIcons = {
    CRITICAL: '🚨',
    WARNING: '⚠️',
    INFO: 'ℹ️',
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 ${severityColors[alert.severity]} ${
        alert.resolved ? 'opacity-60' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{severityIcons[alert.severity]}</span>
            <span className="font-bold text-sm uppercase">{alert.severity}</span>
            {alert.resolved && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                ✓ Resolved
              </span>
            )}
          </div>

          <p className="font-semibold text-lg mb-2">{alert.message}</p>

          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Type:</span>{' '}
              {formatAlertType(alert.alert_type)}
            </p>
            <p>
              <span className="font-medium">Time:</span>{' '}
              {new Date(alert.timestamp).toLocaleString()}
            </p>
            {alert.resolved && alert.resolved_at && (
              <p>
                <span className="font-medium">Resolved:</span>{' '}
                {new Date(alert.resolved_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {showResolve && !alert.resolved && (
          <button
            onClick={() => onResolve(alert.id)}
            className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
};

const formatAlertType = (type) => {
  return type
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export default Alerts;
