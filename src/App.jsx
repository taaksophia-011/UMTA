import React from 'react';
import KpiCards from './components/KpiCards';
import Charts from './components/Charts';
import WorkTable from './components/WorkTable';
import data from './data.json';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Executive Pendency Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            UMTA Work Tracker - Project Status Overview
          </p>
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
