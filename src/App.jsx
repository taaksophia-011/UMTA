import { useState, useEffect } from 'react';
import KpiCards from './components/KpiCards';
import Charts from './components/Charts';
import WorkTable from './components/WorkTable';
import { fetchSheetData } from './utils/googleSheets';
import { Loader2 } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const sheetData = await fetchSheetData();
        setData(sheetData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data from Google Sheets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(getData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-md w-full text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Executive Pendency Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              UMTA Work Tracker - Project Status Overview
            </p>
          </div>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
            Live Sync: <span className="font-semibold text-green-600">Enabled</span>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
            Executive Summary
          </h2>
          <KpiCards data={data} />
        </section>

        {/* Visual Analytics */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full mr-3"></span>
            Visual Analytics
          </h2>
          <Charts data={data} />
        </section>

        {/* Detailed Drill-down */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></span>
            Agency Drill-down
          </h2>
          <WorkTable data={data} />
        </section>
      </div>
    </div>
  );
}

export default App;
