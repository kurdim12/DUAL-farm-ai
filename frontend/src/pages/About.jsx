import React from 'react';
import { Card } from '../components/Card';

const About = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">About DualFarm</h1>
        <p className="text-gray-600 mt-1">System architecture and documentation</p>
      </div>

      {/* Project Overview */}
      <Card title="🌱 Project Overview" className="mb-6">
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>DualFarm Smart Farming System</strong> is an intelligent monitoring and
            control platform designed for hydroponic and aquaponic farming systems. It
            provides real-time monitoring, automated alerts, and AI-powered insights to
            optimize crop yields and resource efficiency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-800 mb-2">Key Features</h3>
              <ul className="text-sm space-y-1">
                <li>✓ Real-time sensor monitoring</li>
                <li>✓ Intelligent alert system</li>
                <li>✓ Remote pump & dosing control</li>
                <li>✓ Interactive data visualization</li>
                <li>✓ AI-powered insights</li>
                <li>✓ Data export & reporting</li>
                <li>✓ Demo simulation mode</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-800 mb-2">Monitored Parameters</h3>
              <ul className="text-sm space-y-1">
                <li>💧 TDS (Total Dissolved Solids)</li>
                <li>🌡️ Temperature</li>
                <li>🧪 pH Level (optional)</li>
                <li>📊 Water Level</li>
                <li>⚙️ Pump Status</li>
                <li>📈 Historical Trends</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* System Architecture */}
      <Card title="🏗️ System Architecture" className="mb-6">
        <div className="space-y-4">
          <pre className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Dashboard │  │  Charts  │  │ Control  │  │  Alerts  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └─────────────┴──────────────┴─────────────┘          │
│                        │                                      │
│                   API Client (Axios)                         │
│                        │                                      │
└────────────────────────┼──────────────────────────────────────┘
                         │ HTTP/JSON
                         │
┌────────────────────────┼──────────────────────────────────────┐
│                        ▼                                       │
│                 FastAPI Backend                                │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  API Routers                                          │   │
│  │  /sensors | /control | /alerts | /actions | /analytics│   │
│  └─────┬─────────────────────────────────────────────────┘   │
│        │                                                      │
│  ┌─────▼──────────────────────────────────────────────────┐  │
│  │  Services Layer                                        │  │
│  │  • Alert Service (Rules Engine)                       │  │
│  │  • Simulation Service (Demo Data Generator)           │  │
│  │  • Analytics Service (AI Insights)                    │  │
│  └─────┬──────────────────────────────────────────────────┘  │
│        │                                                      │
│  ┌─────▼──────────────────────────────────────────────────┐  │
│  │  Database Layer (SQLAlchemy ORM)                      │  │
│  │  • SensorReading • ActionLog • Alert • User          │  │
│  └─────┬──────────────────────────────────────────────────┘  │
│        │                                                      │
│  ┌─────▼──────────────────────────────────────────────────┐  │
│  │  SQLite Database (dualfarm.db)                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌────────────────────┐
              │ Physical Sensors   │
              │ (Future: ESP32/LoRa)│
              └────────────────────┘`}
          </pre>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This MVP uses simulated data for demonstration. In
              production, the backend would integrate with physical sensors via ESP32
              microcontrollers or LoRa modules.
            </p>
          </div>
        </div>
      </Card>

      {/* Technology Stack */}
      <Card title="💻 Technology Stack" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Backend</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-32 font-medium">Framework:</span>
                <span className="text-gray-600">FastAPI (Python)</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 font-medium">Database:</span>
                <span className="text-gray-600">SQLite + SQLAlchemy</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 font-medium">Auth:</span>
                <span className="text-gray-600">JWT (python-jose)</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 font-medium">API Style:</span>
                <span className="text-gray-600">RESTful JSON</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3">Frontend</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-32 font-medium">Framework:</span>
                <span className="text-gray-600">React 18</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 font-medium">Build Tool:</span>
                <span className="text-gray-600">Vite</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 font-medium">Styling:</span>
                <span className="text-gray-600">Tailwind CSS</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 font-medium">Charts:</span>
                <span className="text-gray-600">Recharts</span>
              </li>
              <li className="flex items-center">
                <span className="w-32 font-medium">HTTP Client:</span>
                <span className="text-gray-600">Axios</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* API Endpoints */}
      <Card title="🔌 API Endpoints" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 font-semibold">Method</th>
                <th className="text-left p-2 font-semibold">Endpoint</th>
                <th className="text-left p-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-2 font-mono text-green-600">POST</td>
                <td className="p-2 font-mono">/api/auth/login</td>
                <td className="p-2">User authentication</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-green-600">POST</td>
                <td className="p-2 font-mono">/api/sensors/ingest</td>
                <td className="p-2">Store new sensor reading</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-blue-600">GET</td>
                <td className="p-2 font-mono">/api/sensors/latest</td>
                <td className="p-2">Get most recent reading</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-blue-600">GET</td>
                <td className="p-2 font-mono">/api/sensors/history</td>
                <td className="p-2">Get historical readings</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-green-600">POST</td>
                <td className="p-2 font-mono">/api/control/pump</td>
                <td className="p-2">Control pump ON/OFF</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-green-600">POST</td>
                <td className="p-2 font-mono">/api/control/dose</td>
                <td className="p-2">Dose nutrients</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-blue-600">GET</td>
                <td className="p-2 font-mono">/api/actions/history</td>
                <td className="p-2">Get action logs</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-blue-600">GET</td>
                <td className="p-2 font-mono">/api/alerts/active</td>
                <td className="p-2">Get active alerts</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-green-600">POST</td>
                <td className="p-2 font-mono">/api/simulate/start</td>
                <td className="p-2">Start data simulation</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-blue-600">GET</td>
                <td className="p-2 font-mono">/api/analytics/dashboard</td>
                <td className="p-2">Get dashboard statistics</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-blue-600">GET</td>
                <td className="p-2 font-mono">/api/analytics/insights</td>
                <td className="p-2">Get AI insights</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          📖 Full API documentation available at:{' '}
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            http://localhost:8000/docs
          </a>
        </p>
      </Card>

      {/* Future Enhancements */}
      <Card title="🚀 Future Enhancements" className="mb-6">
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <h4 className="font-bold text-gray-800">Hardware Integration</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>ESP32 microcontroller integration for real sensor data</li>
              <li>LoRa wireless communication for remote farms</li>
              <li>TDS sensor calibration and auto-correction</li>
              <li>Actuator control for automated dosing</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800">Software Features</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Machine learning models for predictive analytics</li>
              <li>WebSocket support for true real-time updates</li>
              <li>Mobile app (React Native)</li>
              <li>Multi-user role-based access control</li>
              <li>Automated nutrient dosing algorithms</li>
              <li>Integration with weather APIs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800">Deployment</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Docker containerization</li>
              <li>Cloud deployment (AWS/Azure/GCP)</li>
              <li>PostgreSQL for production database</li>
              <li>HTTPS/SSL encryption</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Contact Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 text-center">
        <p className="text-2xl mb-2">🌱</p>
        <p className="font-bold text-xl text-gray-800">DualFarm Smart Farming System</p>
        <p className="text-gray-600 mt-2">Version 1.0.0 - RoboCraft Competition MVP</p>
        <p className="text-sm text-gray-500 mt-4">
          Built with React, FastAPI, and Tailwind CSS
        </p>
      </div>
    </div>
  );
};

export default About;
