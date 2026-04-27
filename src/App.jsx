import { useState, useEffect } from 'react';
import PendencyDashboard from './components/PendencyDashboard';
import WorkTable from './components/WorkTable';
import { fetchSheetData } from './utils/googleSheets';
import { Loader2, RefreshCw } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const getData = async () => {
    try {
      const sheetData = await fetchSheetData();
      setData(sheetData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data from Google Sheets. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          <p className="mt-4 text-gray-600 font-bold">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-red-100 max-w-md w-full text-center">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Connection Error</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">{error}</p>
          <button 
            onClick={() => {
              setLoading(true);
              setError(null);
              getData();
            }}
            className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Main Dashboard UI (Mimicking the image) */}
        <section>
          <div className="flex justify-between items-center mb-6 px-4">
            <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Live Sheet Synchronization
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <RefreshCw className="w-3 h-3" />
                Updated: {lastUpdated}
              </div>
            )}
          </div>

          <PendencyDashboard data={data} />
        </section>

        {/* Detailed Drill-down Table */}
        <section className="pt-8">
          <div className="mb-8 px-4">
            <h2 className="text-2xl font-black text-gray-800">Detailed Work Log</h2>
            <p className="text-gray-500 font-medium">Individual assignments per agency as listed in the tracker</p>
          </div>
          <WorkTable data={data.workItems} />
        </section>

        <footer className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
          &copy; 2026 Ludhiana Administration • Project Management Portal
        </footer>
      </div>
    </div>
  );
}

export default App;
